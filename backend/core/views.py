from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_us(request):
    """Handle contact form submissions"""
    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')
    
    # Validate required fields
    if not all([name, email, subject, message]):
        return Response({
            'error': 'All fields are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Send email to admin
        admin_subject = f'New Contact Form Message: {subject}'
        admin_message = f"""
        Name: {name}
        Email: {email}
        Subject: {subject}
        
        Message:
        {message}
        
        ---
        Sent from Spylink Networks Contact Form
        """
        
        send_mail(
            admin_subject,
            admin_message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.CONTACT_EMAIL],  # You'll set this in .env
            fail_silently=False,
        )
        
        # Send auto-reply to user
        user_subject = 'Thank you for contacting Spylink Networks'
        user_html = render_to_string('emails/contact_auto_reply.html', {
            'name': name,
            'message': message,
            'frontend_url': settings.FRONTEND_URL
        })
        user_plain = strip_tags(user_html)
        
        send_mail(
            user_subject,
            user_plain,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            html_message=user_html,
            fail_silently=False,
        )
        
        return Response({
            'message': 'Message sent successfully! We will get back to you soon.'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Contact form error: {e}")
        return Response({
            'error': 'Failed to send message. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)