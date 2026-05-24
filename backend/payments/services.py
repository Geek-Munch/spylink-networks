import requests
import json
import base64
from datetime import datetime
from django.conf import settings
from django.utils import timezone

class MpesaService:
    """Complete M-Pesa Daraja API integration"""
    
    def __init__(self):
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.passkey = settings.MPESA_PASSKEY
        self.shortcode = settings.MPESA_SHORTCODE
        self.callback_url = settings.MPESA_CALLBACK_URL
        
    def get_access_token(self):
        """Get OAuth access token from M-Pesa"""
        url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        
        auth_string = f"{self.consumer_key}:{self.consumer_secret}"
        auth_bytes = auth_string.encode('ascii')
        auth_base64 = base64.b64encode(auth_bytes).decode('ascii')
        
        headers = {
            "Authorization": f"Basic {auth_base64}"
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            if response.status_code == 200:
                data = response.json()
                return data.get('access_token')
            return None
        except Exception as e:
            print(f"Error getting access token: {e}")
            return None
    
    def format_phone_number(self, phone_number):
        """Format phone number to international format"""
        phone_number = ''.join(filter(str.isdigit, phone_number))
        
        if phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        elif phone_number.startswith('254'):
            phone_number = phone_number
        elif phone_number.startswith('+254'):
            phone_number = phone_number[1:]
        
        return phone_number
    
    def initiate_stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """Initiate STK Push to customer's phone"""
        phone_number = self.format_phone_number(phone_number)
        
        access_token = self.get_access_token()
        if not access_token:
            return {"ResponseCode": "1", "ResponseDescription": "Failed to get access token"}
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = f"{self.shortcode}{self.passkey}{timestamp}"
        password_bytes = password_str.encode('ascii')
        password = base64.b64encode(password_bytes).decode('ascii')
        
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": self.callback_url,
            "AccountReference": account_reference[:12],
            "TransactionDesc": transaction_desc[:13]
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            if response.status_code == 200:
                return response.json()
            else:
                return {"ResponseCode": "1", "ResponseDescription": f"STK Push failed: {response.status_code}"}
        except Exception as e:
            return {"ResponseCode": "1", "ResponseDescription": str(e)}
    
    def query_status(self, checkout_request_id):
        """Query the status of an STK Push transaction"""
        access_token = self.get_access_token()
        if not access_token:
            return None
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = f"{self.shortcode}{self.passkey}{timestamp}"
        password_bytes = password_str.encode('ascii')
        password = base64.b64encode(password_bytes).decode('ascii')
        
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            print(f"Error querying status: {e}")
            return None
    
    def handle_callback(self, callback_data):
        """Handle M-Pesa callback after payment"""
        try:
            body = callback_data.get('Body', {})
            stk_callback = body.get('stkCallback', {})
            
            result_code = stk_callback.get('ResultCode')
            checkout_request_id = stk_callback.get('CheckoutRequestID')
            result_desc = stk_callback.get('ResultDesc')
            
            if result_code == 0:
                callback_metadata = stk_callback.get('CallbackMetadata', {})
                items = callback_metadata.get('Item', [])
                
                transaction_data = {}
                for item in items:
                    transaction_data[item.get('Name')] = item.get('Value')
                
                mpesa_receipt = transaction_data.get('MpesaReceiptNumber')
                transaction_id = transaction_data.get('TransactionID')
                
                from .models import Payment
                payment = Payment.objects.filter(
                    checkout_request_id=checkout_request_id
                ).first()
                
                if payment:
                    payment.status = Payment.PaymentStatus.COMPLETED
                    payment.transaction_id = transaction_id
                    payment.mpesa_receipt_number = mpesa_receipt
                    payment.callback_data = callback_data
                    payment.save()
                    
                    try:
                        from accounts.email_service import EmailService
                        EmailService.send_payment_confirmation(payment)
                        if payment.subscription:
                            EmailService.send_subscription_activated(payment.subscription)
                    except Exception as e:
                        print(f"Email error: {e}")
                    
                    if payment.order:
                        payment.order.status = 'PAID'
                        payment.order.paid_at = timezone.now()
                        payment.order.payment_reference = transaction_id
                        payment.order.save()
                        
                        try:
                            from accounts.email_service import EmailService
                            EmailService.send_order_confirmation(payment.order, payment.user)
                        except Exception as e:
                            print(f"Email error: {e}")
                    
                    if payment.subscription:
                        payment.subscription.activate()
                    
                    return {"ResultCode": 0, "ResultDesc": "Success"}
                else:
                    return {"ResultCode": 1, "ResultDesc": "Payment not found"}
            else:
                from .models import Payment
                payment = Payment.objects.filter(
                    checkout_request_id=checkout_request_id
                ).first()
                
                if payment:
                    payment.status = Payment.PaymentStatus.FAILED
                    payment.callback_data = callback_data
                    payment.save()
                
                return {"ResultCode": result_code, "ResultDesc": result_desc}
                
        except Exception as e:
            return {"ResultCode": 1, "ResultDesc": str(e)}