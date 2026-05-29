from django.contrib import admin
from django.contrib.admin import AdminSite
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

class SpylinkAdminSite(AdminSite):
    site_header = "Spylink Networks Admin"
    site_title = "Spylink Admin"
    index_title = "Dashboard"

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        return app_list

admin_site = SpylinkAdminSite(name='spylinkadmin')

# Register all models with the custom admin site
from accounts.models import User
from packages.models import InternetPackage
from products.models import Category, Product
from orders.models import Order, OrderItem
from subscriptions.models import Subscription
from payments.models import Payment

admin_site.register(User)
admin_site.register(InternetPackage)
admin_site.register(Category)
admin_site.register(Product)
admin_site.register(Order)
admin_site.register(Subscription)
admin_site.register(Payment)