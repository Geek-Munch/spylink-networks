from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'method', 'status', 'created_at', 'transaction_id')
    list_filter = ('method', 'status', 'created_at')
    search_fields = ('user__email', 'transaction_id', 'mpesa_receipt_number')
    readonly_fields = ('created_at', 'updated_at', 'callback_data')
    
    fieldsets = (
        ('Payment Info', {'fields': ('user', 'amount', 'method', 'status')}),
        ('Related', {'fields': ('order', 'subscription')}),
        ('Transaction', {'fields': ('transaction_id', 'mpesa_receipt_number', 'phone_number', 'checkout_request_id')}),
        ('Callback', {'fields': ('callback_data',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )