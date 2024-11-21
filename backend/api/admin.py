# backend/api/admin.py

'''
Admin panel for managing orders, user profiles, and reservations in a learning platform. 
It allows administrators to approve or reject orders and reservations, and track 
or modify study hours for each user. Key functionalities include:

1. Order Management: The `OrderAdmin` class displays order details and provides actions to approve 
   or reject orders. When an order is approved, the user's study hours in `UserProfile` are updated 
   accordingly. The order status is set to "approved," and a confirmation message is displayed in the 
   admin panel.

2. Active User Tracking: The `ActiveUserAdmin` class registers the `ActiveUser` model in the admin 
   interface, showing the user along with their last login time.

3. User Profile Management: The `UserProfileAdmin` class displays user profiles, including study 
   hours, which can be edited directly from the list view for quick modifications.

4. Reservation Management: The `ReservationAdmin` class registers the `Reservation` model, 
   allowing admin actions to approve or reject reservations. When approving, it checks if the user has 
   enough study hours; if so, it approves the reservation, deducts one hour, and updates the profile. 
   Error handling is implemented for cases where users have insufficient hours or lack a `UserProfile`.

5. Custom Actions and Error Handling: Custom actions ensure only eligible records are updated 
   (e.g., pending orders or unapproved reservations) and provide informative messages for successful 
   and unsuccessful actions, enhancing the overall functionality and reliability of the admin panel.
'''

from django.contrib import admin
from .models import ActiveUser, UserProfile, Reservation, Order

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