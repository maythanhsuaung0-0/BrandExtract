# BrandExtract API Documentation

This document outlines all the available API endpoints. The general workflow is that a user must first **register** and then **login**. The login response will provide an `access_token`, which must be included in the header of all subsequent authenticated requests.

**Authentication Header:** For all endpoints that require authentication, you must include the following header:
* `Authorization: Bearer <YOUR_ACCESS_TOKEN>`

---
## **1. Authentication API**
**File:** `auth.py` | **Base Path:** `/api/auth`

Handles user registration and login.

#### **1.1 Register a New User**
Creates a new user account.
* **Endpoint:** `POST /api/auth/register`
* **Method:** `POST`
* **Request Body:** `application/json`
    ```json
    {
      "email": "user@example.com",
      "password": "a_strong_password"
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "message": "Registration successful",
      "user_id": "...",
      "email": "user@example.com"
    }
    ```
* **`curl` Example:**
    ```bash
    curl -X POST "[http://127.0.0.1:8000/api/auth/register](http://127.0.0.1:8000/api/auth/register)" \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "password123"}'
    ```

#### **1.2 Login for Access Token**
Authenticates a user and returns an access token for use in other API calls.
* **Endpoint:** `POST /api/auth/login`
* **Method:** `POST`
* **Request Body:** `application/x-www-form-urlencoded` (Note: **not** JSON)
    * `username`: The user's email address.
    * `password`: The user's password.
* **Success Response (200 OK):**
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1Ni...",
      "refresh_token": "...",
      "token_type": "bearer",
      "user": {
        "id": "...",
        "email": "user@example.com"
      }
    }
    ```
* **`curl` Example:**
    ```bash
    curl -X POST "[http://127.0.0.1:8000/api/auth/login](http://127.0.0.1:8000/api/auth/login)" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=test@example.com&password=password123"
    ```

---
## **2. Users API**
**File:** `users.py` | **Base Path:** `/api/users`

Handles fetching and updating user profile information. All endpoints require authentication.

#### **2.1 Get Current User Profile**
Retrieves the profile of the currently logged-in user.
* **Endpoint:** `GET /api/users/me`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Success Response (200 OK):**
    ```json
    {
      "id": "9ead6d44-c55d-495e-aae7-7c6b628becc1",
      "email": "test@example.com",
      "full_name": "John Doe"
    }
    ```

#### **2.2 Update Current User Profile**
Updates the `full_name` of the currently logged-in user.
* **Endpoint:** `PUT /api/users/me`
* **Method:** `PUT`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Request Body:** `application/json`
    ```json
    {
      "full_name": "Johnathan Doe"
    }
    ```
* **Success Response (200 OK):** Returns the updated user object.

---
## **3. Brands API**
**File:** `brands.py` | **Base Path:** `/api/brands`

Handles all CRUD (Create, Read, Update, Delete) operations for user brands. All endpoints require authentication.

#### **3.1 Create a Brand**
* **Endpoint:** `POST /api/brands/`
* **Request Body:** `application/json`
    ```json
    {
      "name": "My New Brand",
      "colors": ["#FFFFFF", "#000000"],
      "fonts": ["Arial", "Roboto"],
      "logo_url": "[http://example.com/logo.png](http://example.com/logo.png)"
    }
    ```
* **Success Response (201 Created):** Returns the newly created brand object, including its `id`.

#### **3.2 Get All User Brands**
* **Endpoint:** `GET /api/brands/`
* **Success Response (200 OK):** Returns a JSON array of brand objects belonging to the user.

#### **3.3 Get a Single Brand**
* **Endpoint:** `GET /api/brands/{brand_id}`
* **Success Response (200 OK):** Returns the JSON for the single brand object specified by `brand_id`.

#### **3.4 Update a Brand**
* **Endpoint:** `PUT /api/brands/{brand_id}`
* **Request Body:** `application/json`. Send only the fields you want to update.
    ```json
    {
      "name": "My Updated Brand Name"
    }
    ```
* **Success Response (200 OK):** Returns the complete, updated brand object.

#### **3.5 Delete a Brand**
* **Endpoint:** `DELETE /api/brands/{brand_id}`
* **Success Response (204 No Content):** Returns an empty response.

#### **4. Start the Application**

To run the backend server, follow these steps:

1. **Navigate to the Backend Directory**

   ```bash
   cd backend
   ```

2. **Create a Virtual Environment**

   ```bash
   python -m venv venv
   ```

3. **Activate the Virtual Environment**

   * **On macOS/Linux:**

     ```bash
     source venv/bin/activate
     ```
   * **On Windows (Command Prompt):**

     ```bash
     venv\Scripts\activate
     ```
   * **On Windows (Git Bash):**

     ```bash
     source venv/Scripts/activate
     ```

4. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Start the Backend Server**

   ```bash
   uvicorn main:app --reload
   ```
