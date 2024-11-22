# backend/api/admin.py

'''
Admin panel for managing the core functionalities of a learning platform. 
It provides tools for administrators to efficiently handle user orders, reservations, and study hours, 
ensuring smooth operations. The key features include:

1. **Order Management**:
   - `OrderAdmin`: Enables viewing, approving, and rejecting orders.
   - Automatically updates user profiles with approved study hours.
   - Sends email notifications to students upon order approval, informing them of their updated study hours.
   - Custom actions like bulk approval or rejection of pending orders streamline management.

2. **Active User Tracking**:
   - `ActiveUserAdmin`: Displays a list of active users with their last login times.

3. **User Profile Management**:
   - `UserProfileAdmin`: Allows administrators to view and edit user study hours directly from the admin list view.
   - Ensures easy monitoring and quick adjustments to user profiles.

4. **Reservation Management**:
   - `ReservationAdmin`: Handles student reservations with options to approve or reject them.
   - Automatically deducts study hours from users' profiles upon approval, ensuring accurate hour tracking.
   - Includes error handling for cases where users lack sufficient hours or a valid user profile.

5. **Custom Actions**:
   - Tailored actions ensure only eligible records are processed (e.g., pending orders or unapproved reservations).
   - Informative messages are displayed for successful and unsuccessful actions, enhancing admin efficiency.

This admin configuration centralizes control over orders, user profiles, and reservations, 
providing a robust and user-friendly interface for administrators.
'''


from django.contrib import admin
from .models import ActiveUser, UserProfile, Reservation, Order
from django.core.mail import send_mail

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('student', 'first_name', 'last_name', 'email', 'hours', 'status', 'created_at')
    list_filter = ('created_at', 'status')
    search_fields = ('student__username', 'first_name', 'last_name', 'email')
    actions = ['approve_orders', 'reject_orders']  

    @admin.action(description='Approve selected orders')
    def approve_orders(self, request, queryset):
        for order in queryset:
            if order.status == 'pending':  
                order.status = 'approved'
                order.save()

                # Updating study hours in UserProfile
                user_profile, created = UserProfile.objects.get_or_create(user=order.student)
                user_profile.study_hours += order.hours 
                user_profile.order_completed = True
                user_profile.save()

                # Send confirmation email to the student
                subject = "Confirmation of Your Study Hour Order"
                message = (
                    f"Dear {order.student.first_name},\n\n"
                    f"We are pleased to inform you that your order for {order.hours} study hours has been successfully approved. "
                    f"You now have {user_profile.study_hours} available study hours in your account.\n\n"
                    f"We wish you great success in your studies!\n\n"
                    f"Best regards,\n"
                    f"The RedBlue Academy Team"
                )
                try:
                    send_mail(
                        subject,
                        message,
                        'info@redblueacademy.com',  # From email
                        [order.student.email],  # To email
                        fail_silently=False,
                    )
                    self.message_user(request, f"A confirmation email has been sent to the student. {order.student.username}.")
                except Exception as e:
                    self.message_user(
                        request,
                        f"Error sending email to student {order.student.username}: {str(e)}",
                        level="error"
                    )
                
                self.message_user(request, f"Order for {order.student.username} has been approved and hours added.")

    @admin.action(description='Reject selected orders')
    def reject_orders(self, request, queryset):
        updated = queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, f"{updated} orders have been rejected.")

# Registering the ActiveUser model in the admin interface
@admin.register(ActiveUser)
class ActiveUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'last_login')  # Displays the user and the last login time

# Registering the UserProfile model in the admin interface
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'study_hours')  # Displays the user and available study hours
    list_editable = ('study_hours',)  # Allows editing of study hours directly in the list view

# Registering the Reservation model in the admin interface with additional customization
@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('student', 'start_time', 'end_time', 'status', 'created_at')  # Displays reservation details
    list_filter = ('status', 'start_time')  # Adds filters for status and start time in the admin panel
    search_fields = ('student__username',)  # Enables search by student's username
    actions = ['approve_reservations', 'reject_reservations']  # Adds custom actions for reservations

    # Custom action to approve selected reservations
    @admin.action(description='Approve selected reservations')
    def approve_reservations(self, request, queryset):
        for reservation in queryset:
            if reservation.status != 'approved':  # Check if the reservation is not already approved
                try:
                    user_profile = UserProfile.objects.get(user=reservation.student)  # Get user profile
                    if user_profile.study_hours > 0:
                        # If user has enough study hours, approve reservation and deduct one hour
                        reservation.status = 'approved'
                        reservation.save()
                        user_profile.study_hours -= 1
                        user_profile.save()
                        self.message_user(request, f"Reservation approved and hours deducted for {reservation.student.username}.")
                    else:
                        # Display an error message if study hours are insufficient
                        self.message_user(request, f"{reservation.student.username} does not have enough study hours.", level="error")
                except UserProfile.DoesNotExist:
                    # Handle case where the user profile does not exist
                    self.message_user(request, f"UserProfile not found for {reservation.student.username}.", level="error")

    # Custom action to reject selected reservations
    @admin.action(description='Reject selected reservations')
    def reject_reservations(self, request, queryset):
        queryset.update(status='rejected')  # Update the status of selected reservations to 'rejected'


