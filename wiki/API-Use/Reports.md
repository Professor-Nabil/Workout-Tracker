# Reports API Documentation

This document outlines the report generation endpoints for the Workout Tracker API.

---

## 1. Get Progress Report

Retrieves a progress report including workout summaries and weight progress for the authenticated user.

### Request

```bash
curl -X GET http://localhost:3000/api/reports/progress \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200 OK)

```json
{
  "workoutSummary": {
    "totalWorkouts": 5,
    "totalDuration": 300,
    "categoryBreakdown": {
      "Strength": 3,
      "Cardio": 2
    }
  },
  "weightProgress": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "weight": 75.5,
      "date": "2026-05-10T09:00:00Z"
    }
  ]
}
```
