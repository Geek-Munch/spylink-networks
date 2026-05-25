from django.http import JsonResponse
from django.urls import path

def home(request):
    return JsonResponse({
        "status": "active",
        "message": "Spylink Networks API is running!",
        "endpoints": {
            "packages": "/api/packages/",
            "products": "/api/products/",
            "admin": "/admin/"
        }
    })

def test_packages(request):
    return JsonResponse([
        {"id": 1, "name": "Basic Home", "price": 1999, "speed": "10 Mbps"},
        {"id": 2, "name": "Pro Home", "price": 3999, "speed": "50 Mbps"},
        {"id": 3, "name": "Business Starter", "price": 7999, "speed": "100 Mbps"},
    ], safe=False)

urlpatterns = [
    path('', home),
    path('api/packages/', test_packages),
]