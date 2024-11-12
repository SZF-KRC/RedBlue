# backend/api/urls.py

'''
Defines URL patterns for API endpoints:
1. User tracking, study hours retrieval, and profile access.
2. Reservation management: creation, listing, status updates, hiding rejected, and deletion.
3. Order management: creating orders and updating study hour orders.

Each URL is linked to a specific view, enabling core functionalities for users, reservations, and orders.
'''

from django.urls import path
from .views import (add_to_active_users_view, get_study_hours, create_reservation, list_reservations, 
                    update_reservation_status, hide_rejected_reservations, delete_reservation, create_order, get_user_profile, create_hour_order)

urlpatterns = [
    path("user/login/track/", add_to_active_users_view, name="track_login"),
    path("user/study_hours/", get_study_hours, name="get_study_hours"),
    path("reservation/create/", create_reservation, name="create_reservation"),
    path("reservations/", list_reservations, name="list_reservations"),
    path("reservation/<int:pk>/update/", update_reservation_status, name="update_reservation_status"),
    path("reservations/hide_rejected/", hide_rejected_reservations, name="hide_rejected_reservations"),
    path("reservation/<int:pk>/", delete_reservation, name="delete_reservation"), 
    path('order/create/', create_order, name='create_order'),
    path('user/profile/', get_user_profile, name='get_user_profile'),
    path('order/update/', create_hour_order, name='create_hour_order'),
]

