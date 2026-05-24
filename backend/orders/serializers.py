from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'quantity', 'price', 'subtotal']
    
    def get_subtotal(self, obj):
        return obj.subtotal

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    items_data = serializers.ListField(write_only=True, required=False)
    total_amount_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'status', 'total_amount', 'total_amount_display',
                  'shipping_address', 'shipping_cost', 'items', 'items_data',
                  'payment_reference', 'paid_at', 'created_at']
        read_only_fields = ['id', 'order_number', 'status', 'total_amount', 
                           'payment_reference', 'paid_at', 'created_at']
    
    def get_total_amount_display(self, obj):
        return f"KES {obj.total_amount:,.2f}"
    
    def create(self, validated_data):
        items_data = validated_data.pop('items_data', [])
        order = Order.objects.create(**validated_data)
        
        total = 0
        for item in items_data:
            product = item['product']
            quantity = item['quantity']
            price = product.price
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )
            total += price * quantity
        
        order.total_amount = total + validated_data.get('shipping_cost', 0)
        order.save()
        
        return order

class CheckoutSerializer(serializers.Serializer):
    items = serializers.ListField(child=serializers.DictField())
    shipping_address = serializers.CharField()
    phone_number = serializers.CharField(max_length=15)
    shipping_cost = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)