# Authentication API Documentation

This document outlines the authentication endpoints for the Workout Tracker API.

---

## 1. Register a New User

Registers a new user in the system.

### Request

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123"}'
```

### Success Response (201 Created)

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Failed Response (400 Bad Request)

```json
{
  "status": "error",
  "message": "Validation failed",
  "details": "Invalid email format"
}
```

---

## 2. Login

Authenticates a user and returns access/refresh tokens.

### Request

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123"}'
```

### Success Response (200 OK)

```json
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

### Failed Response (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

---

## 3. Refresh Access Token

Generates a new access token using a valid refresh token.

### Request

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGci..."}'
```

### Success Response (200 OK)

```json
{
  "accessToken": "eyJhbGci..."
}
```

### Failed Response (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Invalid or expired refresh token"
}
```

---

## 4. Logout

Revokes a refresh token.

### Request

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"refreshToken": "eyJhbGci..."}'
```

### Success Response (200 OK)

```json
{
  "message": "Refresh token revoked"
}
```

### Failed Response (401 Unauthorized)

```json
{
  "status": "error",
  "message": "Unauthorized"
}
```
