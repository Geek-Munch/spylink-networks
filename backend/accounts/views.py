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
from .verification_service import VerificationService
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
        
        
        # Send verification email
        try:
            VerificationService.send_verification_email(user)
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
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Block unverified users
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
        return Response({'error': 'Both old and new passwords are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(old_password):
        return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 6:
        return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
   
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    """Verify user's email with code"""
    user_id = request.data.get('user_id')
    code = request.data.get('code')
    
    if not user_id or not code:
        return Response({'error': 'User ID and verification code are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    success, message = VerificationService.verify_code(user, code)
    
    if success:
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': message,
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_verification(request):
    """Resend verification code"""
    user_id = request.data.get('user_id')
    
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    success, message = VerificationService.resend_verification_code(user)
    
    if success:
        return Response({'message': message}, status=status.HTTP_200_OK)
    else:
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

# Password Reset Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forgot_password(request):
    """Send password reset code to email"""
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal that user doesn't exist for security
        return Response({'message': 'If an account exists with that email, you will receive a reset code.'}, status=status.HTTP_200_OK)
    
    # Generate reset code
    reset_code = ''.join(random.choices(string.digits, k=6))
    user.reset_password_code = reset_code
    user.reset_code_expires = timezone.now() + timedelta(minutes=15)
    user.save()
    
    # Send email
    subject = 'Password Reset Request - Spylink Networks'
    html_message = render_to_string('emails/password_reset.html', {
        'username': user.username,
        'code': reset_code,
        'frontend_url': settings.FRONTEND_URL
    })
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False
        )
        return Response({'message': 'Password reset code sent to your email.'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Email error: {e}")
        return Response({'error': 'Failed to send email. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_reset_code(request):
    """Verify password reset code"""
    email = request.data.get('email')
    code = request.data.get('code')
    
    if not email or not code:
        return Response({'error': 'Email and reset code are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.reset_password_code or user.reset_password_code != code:
        return Response({'error': 'Invalid reset code'}, status=status.HTTP_400_BAD_REQUEST)
    
    if user.reset_code_expires < timezone.now():
        return Response({'error': 'Reset code has expired'}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'message': 'Code verified successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request):
    """Reset password using reset code"""
    email = request.data.get('email')
    code = request.data.get('code')
    new_password = request.data.get('new_password')
    
    if not email or not code or not new_password:
        return Response({'error': 'Email, reset code, and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 6:
        return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.reset_password_code or user.reset_password_code != code:
        return Response({'error': 'Invalid reset code'}, status=status.HTTP_400_BAD_REQUEST)
    
    if user.reset_code_expires < timezone.now():
        return Response({'error': 'Reset code has expired'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.reset_password_code = None
    user.reset_code_expires = None
    user.save()
    
    return Response({'message': 'Password reset successfully. Please login with your new password.'}, status=status.HTTP_200_OK)