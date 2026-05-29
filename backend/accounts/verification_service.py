import random
import string
import resend
from datetime import timedelta
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags
from django.utils import timezone

class VerificationService:
    
    @staticmethod
    def generate_verification_code():
        return ''.join(random.choices(string.digits, k=6))
    
    @staticmethod
    def _send_email(to_email, subject, html_message, plain_message):
        """Central email sender using Resend API"""
        resend.api_key = settings.RESEND_API_KEY
        params = {
            "from": f"Spylink Networks <{settings.DEFAULT_FROM_EMAIL}>",
            "to": [to_email],
            "subject": subject,
            "html": html_message,
            "text": plain_message,
        }
        resend.Emails.send(params)

    @staticmethod
    def send_verification_email(user):
        code = VerificationService.generate_verification_code()
        
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
            VerificationService._send_email(user.email, subject, html_message, plain_message)
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
            VerificationService._send_email(user.email, subject, html_message, plain_message)
            return True, "New verification code sent"
        except Exception as e:
            return False, f"Error sending email: {e}"