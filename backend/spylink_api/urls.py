from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from packages.views import PackageViewSet
from subscriptions.views import SubscriptionViewSet
from products.views import CategoryViewSet, ProductViewSet
from orders.views import OrderViewSet
from payments.views import PaymentViewSet, mpesa_callback, initiate_mpesa_payment, check_payment_status
from accounts.views import RegisterView, LoginView, ProfileView, change_password, verify_email, resend_verification
from core.views import contact_us

router = DefaultRouter()
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/contact/', contact_us, name='contact_us'),
    
    # Authentication endpoints
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/profile/', ProfileView.as_view(), name='profile'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/change-password/', change_password, name='change_password'),
     path('api/auth/verify-email/', verify_email, name='verify_email'),
    path('api/auth/resend-verification/', resend_verification, name='resend_verification'),
    
    # M-Pesa callback endpoint
    path('api/payments/mpesa/callback/', mpesa_callback, name='mpesa_callback'),
    path('api/payments/mpesa/initiate/', initiate_mpesa_payment, name='initiate_mpesa_payment'),
path('api/payments/mpesa/status/', check_payment_status, name='check_payment_status'),
]