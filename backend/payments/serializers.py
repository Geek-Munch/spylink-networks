from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'method', 'status', 'transaction_id', 
                  'mpesa_receipt_number', 'phone_number', 'created_at']
        read_only_fields = ['id', 'status', 'transaction_id', 'mpesa_receipt_number', 'created_at']