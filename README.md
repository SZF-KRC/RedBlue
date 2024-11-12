# RedBlue Academy

**RedBlue Academy** is a comprehensive web application designed for managing lesson reservations, tracking study hours, and allowing users to order additional study hours. The platform offers a secure authentication system, an interactive calendar, and admin management of orders and reservations. Built with a **React** frontend and a **Django** backend, this application provides a seamless experience for both users and administrators.

---

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)

---

## Features

1. **User Authentication**: Enables users to register, log in, and manage sessions securely with JWT tokens.
2. **Order Management**: Users can request additional study hours, which must be approved by an admin.
3. **Interactive Calendar**: Displays lesson reservations with color-coded statuses:
   - **Green**: Approved lessons
   - **Orange**: Pending lessons
   - **Red**: Rejected lessons
4. **Admin Controls**: Admins can view and manage orders, approve/reject them, and adjust user study hours.
5. **Protected Routes**: Restricts access to certain pages based on user authentication and order status.
6. **Session Tracking**: Tracks active user sessions and refreshes access tokens periodically.

---

## Folder Structure

The project is divided into two main parts: the **backend** (Django) and the **frontend** (React). Below is a detailed look at the folder structure.

### Backend (Django)
- **backend/**: Contains the main Django project files and settings.
  - `settings.py`: Configures Django settings, including database, installed apps, middleware, etc.
  - `urls.py`: Main URL configurations for the Django project.
  - `wsgi.py` & `asgi.py`: Web server gateways for deploying the application.
- **api/**: This Django app handles core logic for user management, orders, reservations, and more.
  - `admin.py`: Customizes the Django admin panel for managing orders and reservations, including actions like approval.
  - `apps.py`: Django app configuration for `api`.
  - `models.py`: Defines database models, including `Order`, `Reservation`, `UserProfile`, and `ActiveUser`.
  - `serializers.py`: Serializes model data for API responses, ensuring controlled data exposure.
  - `views.py`: Defines API views for managing orders, reservations, and other functionality.
  - `urls.py`: API-specific URL routing, linking view functions to endpoints.
  - `tests.py`: Contains test cases to verify API endpoints and functionalities.

### Frontend (React)
- **frontend/src**: Contains the main codebase for the frontend, including components, pages, styling, and API configuration.
  - **components/**: Reusable components across different pages.
    - `AuthContext.jsx`: Manages user authentication state, token handling, and provides context to other components.
    - `Footer.jsx`: Footer component displayed across all pages.
    - `Form.jsx`: A form component for handling login and registration.
    - `Header.jsx`: Header with navigation links and user options.
    - `Layout.jsx`: Provides consistent styling and structure.
    - `OrderPending.jsx`: Displays a message indicating an order is pending approval.
    - `ProtectedRoute.jsx`: Controls access to certain routes based on user authentication and order status.
  - **pages/**: Main pages of the application.
    - `Calendar.jsx`: Interactive calendar for managing reservations with color-coded statuses.
    - `CustomSolutions.jsx`: Custom solutions page (details not provided in README).
    - `Faq.jsx`: FAQ page for frequently asked questions.
    - `Home.jsx`: Introduction page for RedBlue Academy.
    - `Login.jsx`: Login page for user authentication.
    - `NotFound.jsx`: 404 page for unrecognized routes.
    - `OrderPage.jsx`: Page for requesting additional study hours.
    - `PriceList.jsx`: Displays pricing for services.
    - `PrivacyPolicy.jsx`: Privacy policy page for GDPR compliance.
    - `Register.jsx`: Registration page for new users.
    - `Services.jsx`: Overview page for services.
    - `TermsOfService.jsx`: Terms of service page.
  - **styles/**: Contains CSS files for each page and component for modular styling.
    - Each file corresponds to a component or page, such as `Calendar.css` for calendar styling and `Header.css` for the header.
  - **assets/**: Typically contains static files like images, fonts, and icons.
  - `api.js`: Configures Axios to handle HTTP requests to the Django backend.
  - `constants.js`: Defines constants, such as token names for `localStorage`.

---

## Usage

1. **Register/Login**: Users can register and log in to access their profile and schedule lessons.
2. **Order Study Hours**: On the OrderPage, users can request additional study hours, which need to be approved by an admin.
3. **View Calendar**: Users can view and manage their reservations in the calendar. Approved lessons are green, pending lessons are orange, and rejected lessons are red.
4. **Admin Panel**: Admins can log in to the Django admin panel (`/admin`) to approve or reject orders and manage study hours.

---

## API Endpoints

| Endpoint                             | Method | Description                                              |
|--------------------------------------|--------|----------------------------------------------------------|
| `/api/user/login/track/`             | POST   | Track user login session                                 |
| `/api/user/study_hours/`             | GET    | Retrieve available study hours for user                  |
| `/api/order/create/`                 | POST   | Create a new order for study hours                       |
| `/api/reservations/`                 | GET    | List reservations with status                            |
| `/api/reservation/create/`           | POST   | Create a reservation                                     |
| `/api/reservation/<pk>/`             | DELETE | Delete a pending reservation                             |
| `/api/reservations/hide_rejected/`   | POST   | Hide rejected reservations                               |

---

## Technologies Used

### Backend:
- **Django**: Web framework for backend logic and API.
- **Django REST Framework**: For building the API.
- **MySQL**: Database .

### Frontend:
- **React**: JavaScript library for building the user interface.
- **FullCalendar**: Calendar component for managing reservations.
- **Axios**: For making HTTP requests to the backend.
- **Bootstrap**: Styling framework for responsive design.

