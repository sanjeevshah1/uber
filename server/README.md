# Uber Server API Documentation

## User Registration Endpoint

### POST /user/register

Registers a new user in the system.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Body
```json
{
    "email": "user@example.com",
    "name": {
        "firstname": "John",
        "lastname": "Doe"  // Optional
    },
    "password": "password123"
}
```

##### Validation Rules
- Email:
  - Required
  - Must be a valid email format
- Name:
  - Firstname:
    - Required
    - Minimum 3 characters
  - Lastname:
    - Optional
    - Minimum 3 characters (if provided)
- Password:
  - Required
  - Minimum 6 characters

#### Response

##### Success Response (201 Created)
```json
{
    "token": "jwt_token_here",
    "_id": "user_id",
    "email": "user@example.com",
    "name": {
        "firstname": "John",
        "lastname": "Doe"
    },
    "socketId": null
}
```

##### Error Response (409 Conflict)
```json
{
    "message": "Error message describing the conflict"
}
```

#### Error Cases
- Email already exists in the system
- Invalid email format
- Password too short
- First name too short
- Last name too short (if provided)

#### Security
- Passwords are hashed using bcrypt before storage
- JWT tokens are signed using RS256 algorithm
- Tokens expire after 1 hour

#### Notes
- The response excludes the password for security reasons
- The JWT token should be included in subsequent requests in the Authorization header
- SocketId is optional and can be updated later for real-time features

#### Example Usage

```javascript
// Using fetch
fetch('/user/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        name: {
            firstname: 'John',
            lastname: 'Doe'
        },
        password: 'password123'
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### Dependencies
- Express.js
- Mongoose
- Bcrypt
- JSON Web Token (JWT)
- Zod (for request validation)

## User Profile Endpoint

### GET /user/profile

Retrieves the profile information of the authenticated user.

#### Request

##### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response

##### Success Response (201 OK)
```json
{
    "_id": "user_id",
    "email": "user@example.com",
    "name": {
        "firstname": "John",
        "lastname": "Doe"
    },
    "socketId": null
}
```

##### Error Response (401 Unauthorized)
```json
{
    "message": "Unauthorized - Invalid or missing token"
}
```

##### Error Response (409 Conflict)
```json
{
    "message": "Error message describing the issue"
}
```

#### Security
- Requires valid JWT token in Authorization header
- Token must not be blacklisted

#### Notes
- The response excludes sensitive information like password
- User must be authenticated to access this endpoint

## User Logout Endpoint

### GET /user/logout

Logs out the current user and invalidates their JWT token.

#### Request

##### Headers
```
Authorization: Bearer <jwt_token>
```

#### Response

##### Success Response (200 OK)
```json
{
    "message": "User logged out successfully"
}
```

##### Error Response (400 Bad Request)
```json
{
    "message": "No token found to logout"
}
```

##### Error Response (500 Internal Server Error)
```json
{
    "message": "Error while logging out the user: [error details]"
}
```

#### Security
- Token is added to blacklist after logout
- Blacklisted tokens expire after 24 hours (86400 seconds)
- Clears the token cookie from the client

#### Notes
- The token can be provided in:
  - Authorization header
  - Cookie
  - x-access-token header
- Once logged out, the token cannot be used for authentication

## User Login Endpoint

### POST /user/login

Authenticates a user and returns a JWT token.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Body
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

##### Validation Rules
- Email:
  - Required
  - Must be a valid email format
- Password:
  - Required
  - Minimum 6 characters

#### Response

##### Success Response (200 OK)
```json
{
    "token": "jwt_token_here",
    "email": "user@example.com",
    "name": {
        "firstname": "John",
        "lastname": "Doe"
    },
    "socketId": null
}
```

##### Error Response (401 Unauthorized)
```json
{
    "message": "Invalid email or password"
}
```

##### Error Response (500 Internal Server Error)
```json
{
    "message": "Error while logging in the user: [error details]"
}
```

#### Security
- Passwords are verified using bcrypt
- JWT tokens are signed using RS256 algorithm
- Tokens expire after 1 hour
- Sets a secure HTTP-only cookie with the token

#### Notes
- The response excludes the password for security reasons
- The JWT token should be included in subsequent requests in the Authorization header
- SocketId is optional and can be updated later for real-time features

#### Example Usage

```javascript
// Using fetch
fetch('/user/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123'
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
``` 