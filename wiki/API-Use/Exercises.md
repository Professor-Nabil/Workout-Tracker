# Exercise API Documentation

This document outlines the exercise management endpoints for the Workout Tracker API.

---

## 1. List Exercise Categories

Retrieves all available exercise categories.

### Request

```bash
curl -X GET http://localhost:3000/api/exercises/categories \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Strength"
  }
]
```

---

## 2. List Exercises

Retrieves all available exercises for the user.

### Request

```bash
curl -X GET http://localhost:3000/api/exercises \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Squat",
    "categoryId": "550e8400-e29b-41d4-a716-446655440002"
  }
]
```

---

## 3. Create Exercise

Creates a new custom exercise.

### Request

```bash
curl -X POST http://localhost:3000/api/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"name": "Deadlift", "categoryId": "550e8400-e29b-41d4-a716-446655440002"}'
```

### Success Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "name": "Deadlift",
  "categoryId": "550e8400-e29b-41d4-a716-446655440002"
}
```

---

## 4. Update Exercise

Updates exercise details.

### Request

```bash
curl -X PATCH http://localhost:3000/api/exercises/550e8400-e29b-41d4-a716-446655440004 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"name": "Sumo Deadlift"}'
```

### Success Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "name": "Sumo Deadlift",
  "categoryId": "550e8400-e29b-41d4-a716-446655440002"
}
```

---

## 5. Delete Exercise

Deletes a custom exercise.

### Request

```bash
curl -X DELETE http://localhost:3000/api/exercises/550e8400-e29b-41d4-a716-446655440004 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
{
  "message": "Exercise deleted successfully"
}
```
