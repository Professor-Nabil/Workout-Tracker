# Workout API Documentation

This document outlines the workout management endpoints for the Workout Tracker API.

---

## 1. Create Workout

Creates a new workout.

### Request

```bash
curl -X POST http://localhost:3000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"title": "Leg Day", "scheduledAt": "2026-05-15T10:00:00Z"}'
```

### Success Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Leg Day",
  "status": "PLANNED"
}
```

---

## 2. List Workouts

Retrieves all workouts for the authenticated user.

### Request

```bash
curl -X GET http://localhost:3000/api/workouts \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Leg Day",
    "status": "PLANNED"
  }
]
```

---

## 3. Get Workout By ID

Retrieves a specific workout.

### Request

```bash
curl -X GET http://localhost:3000/api/workouts/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Leg Day",
  "status": "PLANNED"
}
```

---

## 4. Update Workout

Updates workout details.

### Request

```bash
curl -X PATCH http://localhost:3000/api/workouts/550e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"title": "Updated Leg Day"}'
```

### Success Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Updated Leg Day",
  "status": "PLANNED"
}
```

---

## 5. Delete Workout

Performs a soft delete on a workout.

### Request

```bash
curl -X DELETE http://localhost:3000/api/workouts/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
{
  "message": "Workout deleted successfully"
}
```
