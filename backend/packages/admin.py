from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price', 'subtotal')
    fields = ('product', 'quantity', 'price')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'total_amount', 'status', 'created_at', 'paid_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'user__email', 'shipping_address')
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Info', {'fields': ('order_number', 'user', 'status')}),
        ('Payment', {'fields': ('total_amount', 'payment_reference', 'paid_at')}),
        ('Shipping', {'fields': ('shipping_address', 'shipping_cost')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    actions = ['mark_as_paid', 'mark_as_shipped', 'mark_as_delivered']
    
    def mark_as_paid(self, request, queryset):
        queryset.update(status='PAID')
    mark_as_paid.short_description = "Mark selected orders as Paid"
    
    def mark_as_shipped(self, request, queryset):
        queryset.update(status='SHIPPED')
    mark_as_shipped.short_description = "Mark selected orders as Shipped"
    
    def mark_as_delivered(self, request, queryset):
        queryset.update(status='DELIVERED')
    mark_as_delivered.short_description = "Mark selected orders as Delivered"

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price', 'subtotal')
    list_filter = ('order__status',)
    search_fields = ('order__order_number', 'product__name')
    readonly_fields = ('subtotal',)