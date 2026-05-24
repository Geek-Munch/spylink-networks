from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, CheckoutSerializer
from products.models import Product
from payments.models import Payment
from payments.services import MpesaService
from accounts.email_service import EmailService

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        EmailService.send_order_confirmation(order, request.user)
        
        items_data = serializer.validated_data['items']
        shipping_address = serializer.validated_data['shipping_address']
        phone_number = serializer.validated_data['phone_number']
        shipping_cost = serializer.validated_data['shipping_cost']
        
        # Validate stock and calculate total
        validated_items = []
        total = 0
        
        for item in items_data:
            try:
                product = Product.objects.get(id=item['product_id'], is_active=True)
                quantity = item['quantity']
                
                if product.stock < quantity:
                    return Response({
                        "error": f"Insufficient stock for {product.name}. Available: {product.stock}"
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                validated_items.append({
                    'product': product,
                    'quantity': quantity,
                    'price': product.price
                })
                total += product.price * quantity
                
            except Product.DoesNotExist:
                return Response({
                    "error": f"Product with id {item['product_id']} not found"
                }, status=status.HTTP_404_NOT_FOUND)
        
        with transaction.atomic():
            # Create order
            order = Order.objects.create(
                user=request.user,
                shipping_address=shipping_address,
                shipping_cost=shipping_cost,
                total_amount=total + shipping_cost
            )
            
            # Create order items
            for item in validated_items:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    quantity=item['quantity'],
                    price=item['price']
                )
                # Reduce stock
                item['product'].reduce_stock(item['quantity'])
            
            # Create payment record
            payment = Payment.objects.create(
                user=request.user,
                order=order,
                amount=order.total_amount,
                method=Payment.PaymentMethod.MPESA,
                phone_number=phone_number
            )
            
            # Initiate M-Pesa payment
            mpesa_service = MpesaService()
            response = mpesa_service.initiate_stk_push(
                phone_number=phone_number,
                amount=float(order.total_amount),
                account_reference=f"ORD-{order.id}",
                transaction_desc="SPYLINK NETWORKS"
            )
            
            if response and response.get('ResponseCode') == '0':
                payment.checkout_request_id = response.get('CheckoutRequestID')
                payment.save()
                return Response({
                    "message": "Order created. Complete payment to confirm your order.",
                    "order": OrderSerializer(order).data,
                    "payment_id": payment.id,
                    "checkout_request_id": response.get('CheckoutRequestID')
                }, status=status.HTTP_201_CREATED)
            else:
                order.status = Order.OrderStatus.CANCELLED
                order.save()
                payment.status = Payment.PaymentStatus.FAILED
                payment.save()
                return Response({
                    "error": "Failed to initiate payment. Please try again."
                }, status=status.HTTP_400_BAD_REQUEST)