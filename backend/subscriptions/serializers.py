from rest_framework import serializers
from .models import Subscription
from packages.serializers import InternetPackageSerializer

class SubscriptionSerializer(serializers.ModelSerializer):
    package_details = InternetPackageSerializer(source='package', read_only=True)
    is_active = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    total_due = serializers.SerializerMethodField()
    
    class Meta:
        model = Subscription
        fields = ['id', 'package', 'package_details', 'status', 'start_date', 
                  'end_date', 'auto_renew', 'amount_paid', 'is_active', 'days_remaining',
                  'installation_fee_paid', 'installation_date', 'first_month_free',
                  'free_month_used', 'total_due', 'created_at']
        read_only_fields = ['id', 'status', 'start_date', 'end_date', 'amount_paid', 'created_at']
    
    def get_is_active(self, obj):
        return obj.is_active()
    
    def get_days_remaining(self, obj):
        if obj.end_date:
            from django.utils import timezone
            delta = obj.end_date - timezone.now()
            return max(0, delta.days)
        return 0
    
    def get_total_due(self, obj):
        return obj.calculate_total_due()

class SubscribeSerializer(serializers.Serializer):
    package_id = serializers.IntegerField()
    phone_number = serializers.CharField(max_length=15)
    auto_renew = serializers.BooleanField(default=False)
    installation_date = serializers.DateTimeField(required=False, allow_null=True)