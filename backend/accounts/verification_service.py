import random
import string
from datetime import timedelta
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
from django.utils import timezone

class VerificationService:
    
    @staticmethod
    def generate_verification_code():
        return ''.join(random.choices(string.digits, k=6))
    
    @staticmethod
    def send_verification_email(user):
        code = VerificationService.generate_verification_code()
        
        # Use timezone.now() instead of datetime.now()
        user.email_verification_code = code
        user.verification_code_expires = timezone.now() + timedelta(minutes=15)
        user.save()
        
        subject = 'Verify Your Email - Spylink Networks'
        
        try:
            html_message = render_to_string('emails/verify_email.html', {
                'username': user.username,
                'code': code,
                'frontend_url': settings.FRONTEND_URL
            })
            plain_message = strip_tags(html_message)
        except Exception as e:
            print(f"Template error: {e}")
            # Fallback plain text message
            plain_message = f"""
            Welcome to Spylink Networks, {user.username}!
            
            Your verification code is: {code}
            
            This code will expire in 15 minutes.
            
            If you didn't create an account, please ignore this email.
            
            Best regards,
            Spylink Networks Team
            """
            html_message = plain_message.replace('\n', '<br>')
        
        try:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message,
                fail_silently=False
            )
            return True
        except Exception as e:
            print(f"Email sending error: {e}")
            return False
    
    @staticmethod
    def verify_code(user, code):
        if not user.email_verification_code:
            return False, "No verification code found"
        
        if user.is_verified:
            return False, "Email already verified"
        
        if user.verification_code_expires < timezone.now():
            return False, "Verification code has expired"
        
        if user.email_verification_code != code:
            return False, "Invalid verification code"
        
        user.is_verified = True
        user.email_verification_code = None
        user.verification_code_expires = None
        user.save()
        
        return True, "Email verified successfully"
    
    @staticmethod
    def resend_verification_code(user):
        if user.is_verified:
            return False, "Email already verified"
        
        code = VerificationService.generate_verification_code()
        user.email_verification_code = code
        user.verification_code_expires = timezone.now() + timedelta(minutes=15)
        user.save()
        
        subject = 'New Verification Code - Spylink Networks'
        
        try:
            html_message = render_to_string('emails/verify_email.html', {
                'username': user.username,
                'code': code,
                'frontend_url': settings.FRONTEND_URL
            })
            plain_message = strip_tags(html_message)
        except Exception as e:
            plain_message = f"Your verification code is: {code}"
            html_message = plain_message
        
        try:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=html_message,
                fail_silently=False
            )
            return True, "New verification code sent"
        except Exception as e:
            return False, f"Error sending email: {e}"