# backend/api/views.py

'''
Defines views for handling API requests:
1. User and order management: Create orders, update profiles, and track active users.
2. Reservation handling: Create, delete, list, and update reservation statuses, with admin permissions.
3. Study hours retrieval: Provides available study hours for logged-in users.

Each view includes permissions for secure access and error handling to support the platform's core functionalities.
'''

from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .serializers import UserSerializer, ReservationSerializer, OrderSerializer

from .models import ActiveUser, UserProfile, Reservation, Order
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    serializer = OrderSerializer(data=data)
    
    if serializer.is_valid():
        try:
            # Save the order with `approved=False`
            order = serializer.save(student=request.user, approved=False)

            # Update data in the User model
            user = request.user
            user.first_name = data.get('first_name', '')
            user.last_name = data.get('last_name', '')
            user.email = data.get('email', '')
            user.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(f"Error creating order: {e}")
            return Response({"error": "An internal server error occurred while processing the order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Class-based view for creating a new user
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allows any user to access this endpoint for registration

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    # Creates a new reservation with a default status of "pending"
    data = request.data
    reservation = Reservation(
        student=request.user,
        start_time=data['start_time'],
        end_time=data['end_time'],
        status='pending'
    )
    reservation.save()
    return Response({"message": "Reservation created", "id": reservation.id}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_reservation(request, pk):
    # Deletes a reservation if it belongs to the user and is in "pending" status
    try:
        reservation = Reservation.objects.get(pk=pk, student=request.user)
        if reservation.status == 'pending':
            reservation.delete()
            return Response({"message": "Reservation deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Only pending reservations can be deleted."}, status=status.HTTP_403_FORBIDDEN)
    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def hide_rejected_reservations(request):
    # Hides all rejected reservations for the current user
    Reservation.objects.filter(
        student=request.user,
        status='rejected'
    ).update(hidden_for_student=True)
    return Response({"message": "Rejected reservations hidden"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_reservations(request):
    # Lists all reservations; admin can see all, while users see their own unhidden reservations
    if request.user.is_staff:
        reservations = Reservation.objects.all()
    else:
        reservations = Reservation.objects.filter(
            student=request.user,
            hidden_for_student=False
        )
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_reservation_status(request, pk):
    # Updates the status of a reservation to either "approved" or "rejected"
    try:
        reservation = Reservation.objects.get(pk=pk)
        new_status = request.data.get("status")

        if new_status == "approved":
            # Approve reservation if the user has available study hours
            try:
                user_profile = UserProfile.objects.get(user=reservation.student)
            except UserProfile.DoesNotExist:
                return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)

            if user_profile.study_hours > 0:
                reservation.status = "approved"
                reservation.save()
                user_profile.study_hours -= 1  # Deduct one study hour upon approval
                user_profile.save()
            else:
                return Response({"error": "Insufficient study hours for approval"}, status=status.HTTP_400_BAD_REQUEST)

        elif new_status == "rejected":
            reservation.status = "rejected"
            reservation.save()
        else:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Reservation status updated successfully", "status": reservation.status}, status=status.HTTP_200_OK)

    except Reservation.DoesNotExist:
        return Response({"error": "Reservation not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_study_hours(request):
    # Retrieves available study hours for the current user
    user_profile = UserProfile.objects.get(user=request.user)
    return Response({"study_hours": user_profile.study_hours})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_active_users_view(request):
    # Tracks active user login by creating or updating an ActiveUser record
    user = request.user
    if user.is_authenticated:
        active_user, created = ActiveUser.objects.get_or_create(user=user)
        active_user.save()
        return Response({"status": "User tracked as active"})
    return Response({"status": "Unauthorized"}, status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        pending_order_exists = Order.objects.filter(student=request.user, status='pending').exists()
        completed_order_exists = Order.objects.filter(student=request.user, status='approved').exists()
        profile_data = {
            "username": request.user.username,
            "order_completed": completed_order_exists,
            "order_pending": pending_order_exists,
        }
        return Response(profile_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_hour_order(request):
    try:
        hours = int(request.data.get('hours', 0))
        if hours <= 0:
            return Response({"error": "Invalid number of hours."}, status=status.HTTP_400_BAD_REQUEST)

        # Setting terms_accepted and gdpr_accepted 
        terms_accepted = request.data.get('terms_accepted', True)
        gdpr_accepted = request.data.get('gdpr_accepted', True)

        order = Order.objects.create(
            student=request.user,
            first_name=request.user.first_name,
            last_name=request.user.last_name,
            email=request.user.email,
            hours=hours,
            status='pending',
            approved=False,
            terms_accepted=terms_accepted,
            gdpr_accepted=gdpr_accepted
        )
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except ValueError:
        return Response({"error": "Invalid number format for hours."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("Error creating order:", e)
        return Response({"error": "Failed to create order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


