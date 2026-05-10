# Measurement API Documentation

This document outlines the body measurement management endpoints for the Workout Tracker API.

---

## 1. Create Measurement

Records a new body measurement.

### Request

```bash
curl -X POST http://localhost:3000/api/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"weight": 75.5, "notes": "Morning measurement"}'
```

### Success Response (201 Created)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "weight": 75.5,
  "notes": "Morning measurement",
  "date": "2026-05-10T09:00:00Z"
}
```

---

## 2. List Measurements

Retrieves all recorded measurements for the authenticated user.

### Request

```bash
curl -X GET http://localhost:3000/api/measurements \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "weight": 75.5,
    "date": "2026-05-10T09:00:00Z"
  }
]
```

---

## 3. Update Measurement

Updates an existing measurement.

### Request

```bash
curl -X PATCH http://localhost:3000/api/measurements/550e8400-e29b-41d4-a716-446655440005 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"weight": 74.8}'
```

### Success Response (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "weight": 74.8
}
```

---

## 4. Delete Measurement

Deletes a measurement record.

### Request

```bash
curl -X DELETE http://localhost:3000/api/measurements/550e8400-e29b-41d4-a716-446655440005 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
{
  "message": "Measurement deleted successfully"
}
```
