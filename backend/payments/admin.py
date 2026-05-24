from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'method', 'status', 'created_at')
    list_filter = ('method', 'status')
    search_fields = ('user__email', 'transaction_id', 'mpesa_receipt_number')
    readonly_fields = ('created_at', 'updated_at')