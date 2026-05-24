from django.db import models
from django.conf import settings
from orders.models import Order
from subscriptions.models import Subscription

class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        MPESA = 'MPESA', 'M-Pesa'
        CARD = 'CARD', 'Card'
        BANK = 'BANK', 'Bank Transfer'
    
    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'
        CANCELLED = 'CANCELLED', 'Cancelled'
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    subscription = models.ForeignKey('subscriptions.Subscription', on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    transaction_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    mpesa_receipt_number = models.CharField(max_length=50, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    checkout_request_id = models.CharField(max_length=100, null=True, blank=True)  # Add this field
    callback_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.id} - KES {self.amount}"
    
    def mark_completed(self, transaction_id, mpesa_receipt=None):
        self.status = self.PaymentStatus.COMPLETED
        self.transaction_id = transaction_id
        self.mpesa_receipt_number = mpesa_receipt
        self.save()
        
        if self.order:
            self.order.mark_as_paid(transaction_id)
        
        if self.subscription:
            self.subscription.activate()