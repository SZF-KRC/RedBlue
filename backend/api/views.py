# backend/api/views.py

'''
Handles API requests for user authentication, order management, reservation processing, 
and study hours tracking within the learning platform. Key functionalities include:

1. **User and Profile Management**:
   - `CreateUserView`: Allows new user registration.
   - `get_user_profile`: Fetches user-specific details like order status (completed or pending).

2. **Order Management**:
   - `create_order` and `create_hour_order`: Handle order creation for study hours with terms validation.
   - Automatically updates user details and manages pending or approved order statuses.

3. **Reservation Handling**:
   - `create_reservation`: Allows users to book lessons with a default "pending" status.
   - `delete_reservation`: Enables users to delete their pending reservations.
   - `list_reservations`: Lists reservations; admins can view all, while users see their own unhidden reservations.
   - `update_reservation_status`: Admin functionality to approve or reject reservations with automatic deduction of study hours on approval.
   - `hide_rejected_reservations`: Hides rejected reservations from the user's view.

4. **Study Hours Management**:
   - `get_study_hours`: Retrieves available study hours for logged-in users.
   - Updates study hours upon order approval or reservation processing.

5. **Active User Tracking**:
   - `add_to_active_users_view`: Tracks user login activity by managing `ActiveUser` records.

6. **Error Handling**:
   - Implements comprehensive error messages and status codes for better user experience.
   - Handles exceptions like insufficient study hours, invalid data, or missing profiles.

This file consolidates all core API endpoints, ensuring seamless interaction between the backend 
and the platform for managing orders, reservations, and user profiles.
'''


from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .serializers import UserSerializer, ReservationSerializer, OrderSerializer
from rest_framework.exceptions import ValidationError
from .models import ActiveUser, UserProfile, Reservation, Order
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.conf import settings

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

            # Send welcome email
            send_welcome_email(order)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(f"Error creating order: {e}")
            return Response({"error": "An internal server error occurred while processing the order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        # Checking if a user has an approved order
        approved_order_exists = Order.objects.filter(student=request.user, status='approved').exists()

        # Checking if there is a new "pending" order
        pending_order_exists = Order.objects.filter(student=request.user, status='pending').exists()

        # If there is an approved order but also a new "pending" order, prioritize the approved one.
        order_pending = pending_order_exists and not approved_order_exists

        profile_data = {
            "username": request.user.username,
            "order_completed": approved_order_exists,
            "order_pending": order_pending,
        }
        return Response(profile_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# New order for hours   
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
        send_email_new_order(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except ValueError:
        return Response({"error": "Invalid number format for hours."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("Error creating order:", e)
        return Response({"error": "Failed to create order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

def calculate_price(order):
    """Calculate price per hour and total price based on the number of hours."""
    if order.hours >= 160:
        price_per_hour = 9
    elif order.hours >= 30:
        price_per_hour = 12
    else:
        price_per_hour = 24

    total_price = order.hours * price_per_hour
    return price_per_hour, total_price


def send_email(order, subject, message_template):
    """Send an email based on the provided subject and message template."""
    price_per_hour, total_price = calculate_price(order)

    # Prepare the email content
    message = message_template.format(
        first_name=order.first_name,
        last_name=order.last_name,
        email=order.email,
        hours=order.hours,
        price_per_hour=price_per_hour,
        total_price=total_price
    )

    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [order.email]

    try:
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        print(f"Email sent to {order.email} with subject: {subject}")
    except Exception as e:
        print(f"Error sending email to {order.email}: {e}")


def send_welcome_email(order):
    subject = "Welcome to Our Learning Platform!"
    message_template = """
    Dear {first_name} {last_name},

    Thank you for your first order on our platform! Here are the details of your order:

    - Name: {first_name} {last_name}
    - Email: {email}
    - Ordered Hours: {hours}
    - Price per Hour: {price_per_hour} EUR (including VAT)
    - Total Price: {total_price} EUR (including VAT)

    Please transfer the payment to the following account:

    Account Number: 123456789
    Bank Name: XYZ Bank
    IBAN: SK12345678901234567890
    SWIFT/BIC: XYZBSKBB
    Reference: {email}

    Once the payment is received, your order will be approved, and you can start booking your lessons.

    Best regards,
    The RedBlue Academy Team
    """
    send_email(order, subject, message_template)


def send_email_new_order(order):
    subject = "Your New Order"
    message_template = """
    Dear {first_name} {last_name},

    Thank you for ordering additional teaching hours! We look forward to continuing your journey with us as you work towards a career in programming. Here are the details of your order:

    - Name: {first_name} {last_name}
    - Email: {email}
    - Ordered Hours: {hours}
    - Price per Hour: {price_per_hour} EUR (including VAT)
    - Total Price: {total_price} EUR (including VAT)

    Please transfer the payment to the following account:

    Account Number: 123456789
    Bank Name: XYZ Bank
    IBAN: SK12345678901234567890
    SWIFT/BIC: XYZBSKBB
    Reference: {email}

    Once the payment is received, your order will be approved, and you can continue booking your lessons as usual.

    Best regards,
    The RedBlue Academy Team
    """
    send_email(order, subject, message_template)


