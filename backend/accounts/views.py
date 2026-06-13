from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
import random
import string

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # User starts as unverified
        user.is_verified = False
        user.save()
        
        # Generate and send verification code
        code = ''.join(random.choices(string.digits, k=6))
        user.email_verification_code = code
        user.verification_code_expires = timezone.now() + timedelta(minutes=15)
        user.save()
        
        # Send verification email
        subject = 'Verify Your Email - Spylink Networks'
        message = f"""
        Welcome to Spylink Networks, {user.username}!
        
        Your verification code is: {code}
        
        This code will expire in 15 minutes.
        
        Enter this code on the verification page to complete your registration.
        
        If you didn't create an account, please ignore this email.
        
        Best regards,
        Spylink Networks Team
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            email_sent = True
        except Exception as e:
            print(f"Email error: {e}")
            email_sent = False
        
        return Response({
            'message': 'Verification code sent to your email. Please verify to complete registration.',
            'user_id': user.id,
            'email': user.email,
            'email_sent': email_sent
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=email, password=password)
        
        if not user:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if email is verified
        if not user.is_verified:
            return Response({
                'error': 'Please verify your email before logging in.',
                'user_id': user.id,
                'requires_verification': True
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not old_password or not new_password:
        return Response({
            'error': 'Both old and new passwords are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(old_password):
        return Response({
            'error': 'Current password is incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 6:
        return Response({
            'error': 'Password must be at least 6 characters'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response({
        'message': 'Password changed successfully'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    """Verify user's email with 6-digit code"""
    user_id = request.data.get('user_id')
    code = request.data.get('code')
    
    if not user_id or not code:
        return Response({
            'error': 'User ID and verification code are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if user.is_verified:
        return Response({
            'error': 'Email already verified'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.email_verification_code:
        return Response({
            'error': 'No verification code found. Request a new code.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if user.verification_code_expires < timezone.now():
        return Response({
            'error': 'Verification code has expired. Request a new code.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if user.email_verification_code != code:
        return Response({
            'error': 'Invalid verification code'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Mark as verified
    user.is_verified = True
    user.email_verification_code = None
    user.verification_code_expires = None
    user.save()
    
    # Generate tokens for auto-login after verification
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'Email verified successfully! You can now login.',
        'user': UserSerializer(user).data,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_verification(request):
    """Resend verification code to user's email"""
    user_id = request.data.get('user_id')
    
    if not user_id:
        return Response({
            'error': 'User ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if user.is_verified:
        return Response({
            'error': 'Email already verified'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate new code
    code = ''.join(random.choices(string.digits, k=6))
    user.email_verification_code = code
    user.verification_code_expires = timezone.now() + timedelta(minutes=15)
    user.save()
    
    # Send email
    subject = 'New Verification Code - Spylink Networks'
    message = f"""
    Your new verification code is: {code}
    
    This code will expire in 15 minutes.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    Spylink Networks Team
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        email_sent = True
    except Exception as e:
        print(f"Email error: {e}")
        email_sent = False
    
    return Response({
        'message': 'New verification code sent to your email.',
        'email_sent': email_sent
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forgot_password(request):
    """Send password reset code to email"""
    email = request.data.get('email')
    
    if not email:
        return Response({
            'error': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal that user doesn't exist for security
        return Response({
            'message': 'If an account exists with that email, you will receive a reset code.'
        }, status=status.HTTP_200_OK)
    
    # Generate reset code
    reset_code = ''.join(random.choices(string.digits, k=6))
    user.reset_password_code = reset_code
    user.reset_code_expires = timezone.now() + timedelta(minutes=15)
    user.save()
    
    subject = 'Password Reset Request - Spylink Networks'
    message = f"""
    Hello {user.username},
    
    We received a request to reset your password.
    
    Your password reset code is: {reset_code}
    
    This code will expire in 15 minutes.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    Spylink Networks Team
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Email error: {e}")
    
    return Response({
        'message': 'If an account exists with that email, you will receive a reset code.'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_reset_code(request):
    """Verify password reset code"""
    email = request.data.get('email')
    code = request.data.get('code')
    
    if not email or not code:
        return Response({
            'error': 'Email and reset code are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({
            'error': 'Invalid request'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.reset_password_code or user.reset_password_code != code:
        return Response({
            'error': 'Invalid reset code'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if user.reset_code_expires < timezone.now():
        return Response({
            'error': 'Reset code has expired'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'message': 'Code verified successfully'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    """Reset password using reset code"""
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')
    
    if not email or not code or not new_password:
        return Response({
            'error': 'Email, reset code, and new password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 6:
        return Response({
            'error': 'Password must be at least 6 characters'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({
            'error': 'Invalid request'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.reset_password_code or user.reset_password_code != code:
        return Response({
            'error': 'Invalid reset code'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if user.reset_code_expires < timezone.now():
        return Response({
            'error': 'Reset code has expired'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.reset_password_code = None
    user.reset_code_expires = None
    user.save()
    
    return Response({
        'message': 'Password reset successfully. Please login with your new password.'
    }, status=status.HTTP_200_OK)