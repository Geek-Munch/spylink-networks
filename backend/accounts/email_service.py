from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

class EmailService:
    
    @staticmethod
    def send_welcome_email(user):
        """Send welcome email to new user"""
        subject = 'Welcome to Spylink Networks!'
        html_message = render_to_string('emails/welcome.html', {
            'username': user.username,
            'email': user.email,
            'frontend_url': settings.FRONTEND_URL
        })
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False
        )
    
    @staticmethod
    def send_order_confirmation(order, user):
        """Send order confirmation email"""
        items = []
        subtotal = 0
        for item in order.items.all():
            items.append({
                'name': item.product.name,
                'quantity': item.quantity,
                'price': item.price
            })
            subtotal += item.price * item.quantity
        
        subject = f'Order Confirmation - #{order.order_number}'
        html_message = render_to_string('emails/order_confirmation.html', {
            'username': user.username,
            'order_number': order.order_number,
            'order_date': order.created_at.strftime('%B %d, %Y'),
            'items': items,
            'subtotal': subtotal,
            'shipping_cost': order.shipping_cost,
            'total': order.total_amount,
            'shipping_address': order.shipping_address,
            'frontend_url': settings.FRONTEND_URL
        })
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False
        )
    
    @staticmethod
    def send_payment_confirmation(payment):
        """Send payment confirmation email"""
        subject = 'Payment Confirmation - Spylink Networks'
        context = {
            'username': payment.user.username,
            'amount': payment.amount,
            'payment_method': payment.method,
            'transaction_id': payment.transaction_id or 'Pending',
            'mpesa_receipt': payment.mpesa_receipt_number,
            'payment_date': payment.created_at.strftime('%B %d, %Y'),
            'frontend_url': settings.FRONTEND_URL
        }
        
        if payment.subscription:
            context['subscription_name'] = payment.subscription.package.name
            context['expiry_date'] = payment.subscription.end_date.strftime('%B %d, %Y')
        
        html_message = render_to_string('emails/payment_confirmation.html', context)
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [payment.user.email],
            html_message=html_message,
            fail_silently=False
        )
    
    @staticmethod
    def send_subscription_activated(subscription):
        """Send subscription activation email"""
        subject = f'Subscription Activated - {subscription.package.name}'
        html_message = render_to_string('emails/subscription_activated.html', {
            'username': subscription.user.username,
            'package_name': subscription.package.name,
            'speed': subscription.package.speed,
            'price': subscription.package.price,
            'end_date': subscription.end_date.strftime('%B %d, %Y'),
            'auto_renew': 'Yes' if subscription.auto_renew else 'No',
            'frontend_url': settings.FRONTEND_URL
        })
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [subscription.user.email],
            html_message=html_message,
            fail_silently=False
        )