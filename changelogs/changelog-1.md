# Changelog 1: Initial Authentication API Development (Custom JWT, Drizzle ORM, PostgreSQL)

## Feature: Custom JWT Authentication API with Next.js, Drizzle ORM, and PostgreSQL

This changelog outlines the plan for implementing a custom authentication API using JSON Web Tokens (JWT) and Next.js API Routes, leveraging **Drizzle ORM** for database interactions with **PostgreSQL**. This system will establish user identity and manage different access levels within the application.

### 1. Database and ORM Setup

| Task | Description | Status |
| :--- | :--- | :--- |
| **PostgreSQL Setup** | Configure a local or remote PostgreSQL instance for development. | Pending |
| **Drizzle ORM Setup** | Install Drizzle dependencies and configure the connection. | Pending |
| **Define User Schema** | Create the Drizzle schema for the `users` table, including fields for credentials, role, and plan. | Pending |
| **Run Migrations** | Generate and run initial database migrations. | Pending |

### 2. Core Authentication API Implementation

| Task | Description | Status |
| :--- | :--- | :--- |
| **Setup Auth Routes** | Create all necessary Next.js API routes: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/forgot-password`, `/api/auth/reset-password`, and OAuth routes (`/api/auth/oauth/google`, `/api/auth/oauth/callback`). | Pending |
| **Create Auth UI** | Implement client-side components for **Sign In**, **Register**, **Forget Password** screens, including OAuth provider buttons. | Pending |
| **Client-Side Logic** | Implement client-side logic to handle form submission and API calls for all authentication flows. | Pending |
| **User Registration Logic** | Implement user registration using Drizzle to insert new users into PostgreSQL, including password hashing (e.g., with `bcrypt`). | Pending |
| **User Login Logic** | Implement user login, verifying credentials against PostgreSQL using Drizzle and comparing hashed passwords. | Pending |
| **Forget Password Logic** | Implement API logic for password reset request (e.g., token generation and email sending). | Pending |
| **Reset Password Logic** | Implement API logic for password reset confirmation (e.g., token verification and password update). | Pending |
| **JWT Generation** | Implement logic to generate a JWT upon successful login/registration, including user ID and role/plan in the payload. | Pending |
| **JWT Verification** | Create a middleware or utility function to verify the JWT on protected API routes. | Pending |
| **Secure Storage** | Implement secure storage of the JWT (e.g., using HTTP-only cookies). | Pending |
| **Error Handling** | Implement robust error handling for all authentication failures. | Pending |

### 3. OAuth Integration (e.g., Google)

| Task | Description | Status |
| :--- | :--- | :--- |
| **OAuth Provider Setup** | Register the application with the chosen OAuth provider (e.g., Google) to obtain Client ID and Secret. | Pending |
| **Initiate OAuth Flow** | Implement the `/api/auth/oauth/google` route to redirect the user to the provider's authorization page. | Pending |
| **Handle OAuth Callback** | Implement the `/api/auth/oauth/callback` route to handle the provider's response, exchange the code for an access token, and fetch user profile data. | Pending |
| **User Provisioning** | Check if the user exists in the PostgreSQL database; if not, create a new user record (provisioning). | Pending |
| **JWT Generation (OAuth)** | Generate a local JWT for the user after successful OAuth authentication. | Pending |

### 4. User Roles and Access Control

The system will support the following user roles, which will be encoded in the JWT payload for authorization checks:

| Role | Description | Access Level |
| :--- | :--- | :--- |
| **`guest`** | Unauthenticated user. | Public routes only. |
| **`authenticated-user`** | Base level for logged-in users. | Access to core application features. |
| **`free-plan`** | Authenticated user with free-tier limitations. | Limited access to premium features. |
| **`express`** | Authenticated user with an 'Express' subscription. | Enhanced access to features. |
| **`premium`** | Authenticated user with a 'Premium' subscription. | Full access to all features. |
| **`admin`** | Application administrator. | Full access to all features and administrative endpoints. |

### 5. Next Steps

1.  **Authorization Middleware:** Implement route protection on the client and server side based on the user's role/plan.
2.  **Environment Variables:** Securely configure JWT secret key, PostgreSQL connection string, **OAuth Client ID/Secret**, and other sensitive settings using environment variables.
