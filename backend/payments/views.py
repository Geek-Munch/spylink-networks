from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Payment
from .serializers import PaymentSerializer
from .services import MpesaService
import json

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        payment = self.get_object()
        return Response({
            "status": payment.status,
            "amount": payment.amount,
            "transaction_id": payment.transaction_id,
            "mpesa_receipt": payment.mpesa_receipt_number,
            "payment_method": payment.method
        })

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def mpesa_callback(request):
    """Handle M-Pesa callback after payment"""
    try:
        callback_data = request.data
        mpesa_service = MpesaService()
        result = mpesa_service.handle_callback(callback_data)
        
        if result.get('resultCode') == 0:
            return Response({"ResultCode": 0, "ResultDesc": "Success"})
        else:
            return Response({"ResultCode": 1, "ResultDesc": "Failed"}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({"ResultCode": 1, "ResultDesc": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def initiate_mpesa_payment(request):
    """Initiate M-Pesa STK Push payment"""
    try:
        phone_number = request.data.get('phone_number')
        amount = request.data.get('amount')
        account_reference = request.data.get('account_reference', 'SPYLINK')
        transaction_desc = request.data.get('transaction_desc', 'Internet Payment')
        
        if not phone_number or not amount:
            return Response({
                "error": "Phone number and amount are required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        mpesa_service = MpesaService()
        response = mpesa_service.initiate_stk_push(
            phone_number=phone_number,
            amount=float(amount),
            account_reference=account_reference,
            transaction_desc=transaction_desc
        )
        
        if response and response.get('ResponseCode') == '0':
            # Create a pending payment record
            payment = Payment.objects.create(
                user=request.user,
                amount=amount,
                method=Payment.PaymentMethod.MPESA,
                status=Payment.PaymentStatus.PENDING,
                phone_number=phone_number,
                checkout_request_id=response.get('CheckoutRequestID')
            )
            
            return Response({
                "success": True,
                "message": "STK Push sent. Check your phone to complete payment.",
                "payment_id": payment.id,
                "checkout_request_id": response.get('CheckoutRequestID')
            })
        else:
            return Response({
                "error": response.get('ResponseDescription', 'Failed to initiate payment')
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def check_payment_status(request):
    """Check the status of a payment"""
    checkout_request_id = request.data.get('checkout_request_id')
    
    if not checkout_request_id:
        return Response({
            "error": "Checkout request ID is required"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        mpesa_service = MpesaService()
        response = mpesa_service.query_status(checkout_request_id)
        
        if response:
            return Response({
                "success": True,
                "status": response.get('ResultCode'),
                "message": response.get('ResultDesc')
            })
        else:
            return Response({
                "error": "Failed to check payment status"
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)