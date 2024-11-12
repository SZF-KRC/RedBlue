# backend/backend/urls.py

'''
Defines URL routing for the Django application:
1. Admin panel access for application management.
2. User registration and JWT-based authentication (with token refresh).
3. API endpoints for app-specific functionalities via `api` routes.

These routes structure the application to handle admin tasks, authentication, and API access.
'''

from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),  # Admin panel for managing the application
    path("api/user/register/", CreateUserView.as_view(), name="register"),  # Endpoint for user registration
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),  # Endpoint for obtaining JWT token
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),  # Endpoint for refreshing JWT token
    path("api-auth/", include("rest_framework.urls")),  # Login and logout routes for the browsable API
    path("api/", include("api.urls")),  # Includes additional API endpoints from the `api` app
]



