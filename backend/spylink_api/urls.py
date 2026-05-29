from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from packages.views import PackageViewSet
from subscriptions.views import SubscriptionViewSet
from products.views import CategoryViewSet, ProductViewSet
from orders.views import OrderViewSet
from payments.views import PaymentViewSet, mpesa_callback
from accounts.views import (
    RegisterView, LoginView, ProfileView, change_password,
    verify_email, resend_verification, forgot_password,
    verify_reset_code, reset_password
)
from core.views import contact_us
from django.http import HttpResponse
from django.core.management import call_command
from django.http import JsonResponse
import traceback

def health_check(request):
    return JsonResponse({"status": "ok", "message": "Spylink API is running!"})

def run_migrations(request):
    try:
        call_command('migrate', '--noinput')
        return HttpResponse("Migrations completed successfully! Your database is now ready.")
    except Exception as e:
        return HttpResponse(f"Error: {str(e)}<br><br>Traceback:<br>{traceback.format_exc()}", status=500)
    
def load_fixtures(request):
    try:
        call_command('loaddata', 'packages_data.json')
        call_command('loaddata', 'products_data.json')
        return HttpResponse("Data loaded successfully!")
    except Exception as e:
        return HttpResponse(f"Error: {str(e)}<br><br>{traceback.format_exc()}", status=500)

# Create router
router = DefaultRouter()
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('api/', include(router.urls)),
    path('run-migrations/', run_migrations),
    path('migrate/', run_migrations), 
    path('', health_check), 
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/profile/', ProfileView.as_view(), name='profile'),
    path('api/auth/change-password/', change_password, name='change_password'),
    path('api/auth/verify-email/', verify_email, name='verify_email'),
    path('api/auth/resend-verification/', resend_verification, name='resend_verification'),
    path('api/auth/forgot-password/', forgot_password, name='forgot_password'),
    path('api/auth/verify-reset-code/', verify_reset_code, name='verify_reset_code'),
    path('api/auth/reset-password/', reset_password, name='reset_password'),
    
    # Contact
    path('api/contact/', contact_us, name='contact_us'),
    
    # M-Pesa
    path('api/payments/mpesa/callback/', mpesa_callback, name='mpesa_callback'),
]