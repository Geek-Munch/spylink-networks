from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from .models import Subscription
from .serializers import SubscriptionSerializer, SubscribeSerializer
from packages.models import InternetPackage
from payments.models import Payment
from payments.services import MpesaService

class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        serializer = SubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        package_id = serializer.validated_data['package_id']
        phone_number = serializer.validated_data['phone_number']
        auto_renew = serializer.validated_data['auto_renew']
        installation_date = serializer.validated_data.get('installation_date')
        
        try:
            package = InternetPackage.objects.get(id=package_id, is_active=True)
        except InternetPackage.DoesNotExist:
            return Response({"error": "Package not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Calculate total amount (package price + installation fee if not already paid)
        total_amount = package.price
        if not package.first_month_free:
            total_amount += package.price  # First month not free
        # Installation fee will be collected separately or added to first bill
        
        with transaction.atomic():
            subscription = Subscription.objects.create(
                user=request.user,
                package=package,
                amount_paid=total_amount,
                auto_renew=auto_renew,
                first_month_free=package.first_month_free,
                installation_fee_paid=False
            )
            
            # Schedule installation if date provided
            if installation_date:
                subscription.schedule_installation(installation_date)
            
            # Calculate total payment due (including installation fee)
            total_due = package.price + package.installation_fee
            
            payment = Payment.objects.create(
                user=request.user,
                subscription=subscription,
                amount=total_due,
                method=Payment.PaymentMethod.MPESA,
                phone_number=phone_number
            )
            
            # Initiate M-Pesa payment
            mpesa_service = MpesaService()
            response = mpesa_service.initiate_stk_push(
                phone_number=phone_number,
                amount=float(total_due),
                account_reference=f"SUB-{subscription.id}",
                transaction_desc=f"{package.name[:10]}"
            )
            
            if response and response.get('ResponseCode') == '0':
                payment.checkout_request_id = response.get('CheckoutRequestID')
                payment.save()
                return Response({
                    "message": "STK Push initiated. Check your phone to complete payment.",
                    "subscription_id": subscription.id,
                    "payment_id": payment.id,
                    "checkout_request_id": response.get('CheckoutRequestID'),
                    "total_amount": total_due,
                    "breakdown": {
                        "installation_fee": float(package.installation_fee),
                        "first_month_fee": 0 if package.first_month_free else float(package.price),
                        "monthly_subscription": float(package.price)
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                subscription.status = Subscription.SubscriptionStatus.CANCELLED
                subscription.save()
                payment.status = Payment.PaymentStatus.FAILED
                payment.save()
                return Response({
                    "error": "Failed to initiate payment. Please try again."
                }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        subscription = self.get_object()
        
        if subscription.status == Subscription.SubscriptionStatus.ACTIVE:
            subscription.status = Subscription.SubscriptionStatus.CANCELLED
            subscription.save()
            return Response({"message": "Subscription cancelled successfully"})
        elif subscription.status == Subscription.SubscriptionStatus.PENDING:
            subscription.status = Subscription.SubscriptionStatus.CANCELLED
            subscription.save()
            return Response({"message": "Subscription request cancelled"})
        elif subscription.status == Subscription.SubscriptionStatus.INSTALLATION:
            subscription.status = Subscription.SubscriptionStatus.CANCELLED
            subscription.save()
            return Response({"message": "Installation request cancelled"})
        
        return Response({"error": "Cannot cancel this subscription"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def confirm_installation(self, request, pk=None):
        """Admin endpoint to confirm installation completion"""
        subscription = self.get_object()
        
        if subscription.status == Subscription.SubscriptionStatus.INSTALLATION:
            subscription.complete_installation()
            return Response({
                "message": "Installation confirmed! Your first month is free. Billing starts next month.",
                "status": subscription.status,
                "next_billing_date": subscription.end_date
            })
        
        return Response({"error": "No pending installation found"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        subscription = self.get_object()
        return Response({
            "is_active": subscription.is_active(),
            "status": subscription.status,
            "start_date": subscription.start_date,
            "end_date": subscription.end_date,
            "installation_date": subscription.installation_date,
            "installation_fee_paid": subscription.installation_fee_paid,
            "first_month_free": subscription.first_month_free,
            "free_month_used": subscription.free_month_used
        })