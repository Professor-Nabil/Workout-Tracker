# API - Create New User

---

## Request

- URL: `/api/auth/signup`
- Method: POST
- Content-Type: application/json
- Body:
  - email:
    - Required
    - Must follow standard email format
    - Email maximum length (Standard is 255)
  - password:
    - Required
    - Must be at least 6 characters

---

## Request Body Example

```json
{
  "email": "user123@email.com",
  "password": "user_password"
}
```

---

## Response

- Success:
  - Status: 201
  - Response Body Example:

  ```json
  {
    "message": "User created successfully",
    "data": {
      "user": {
        "id": "long-uuid...",
        "email": "user@example.com",
        "createdAt": "2000-1-1T00:00:00Z"
      },
      "token": "long-token..."
    }
  }
  ```

- Failed:
  - Status: 400 (Bad Request) Validation Error
    - If no password provided
    - If no email provided
    - If request body is empty
    - If password is less than 6 chars
    - If email is invalid
  - Status: 409 (Conflict) Conflict Error
    - If user already exists
  - Status: 500 (Internal Server Error) Server Error

- Response Error Body Example

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "field": "password",
    "message": "Password must be at least 6 characters long"
  }
}
```

## Security

- Rate Limit: Max 5 attempts per hour per IP.
- Password: Never return password, even hashed.
- Authentication Token: Return a token (JWT) in success data.
