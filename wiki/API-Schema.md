# API Data Schemas

This document defines the expected JSON data structures for API request and response bodies.

## Authentication

### Sign Up Input

```json
{
  "email": "string",
  "password": "string"
}
```

### Sign Up Output

```json
{
  "userId": "uuid"
}
```

### Auth Response

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

### Refresh Input

```json
{
  "refreshToken": "string"
}
```

### Logout Input

```json
{
  "refreshToken": "string"
}
```

## Workouts

### Workout Input (Create/Update)

```json
{
  "title": "string",
  "status": "PLANNED | IN_PROGRESS | COMPLETED | CANCELLED",
  "scheduledAt": "ISO-8601 string",
  "comments": "string",
  "startedAt": "ISO-8601 string",
  "endedAt": "ISO-8601 string",
  "exercises": [
    {
      "exerciseId": "uuid",
      "sequence": "number",
      "sets": "number",
      "reps": "number",
      "weight": "number",
      "weightUnit": "KG | LBS",
      "duration": "number",
      "isCompleted": "boolean"
    }
  ]
}
```

### Workout Output

```json
{
  "id": "uuid",
  "title": "string",
  "status": "string",
  "scheduledAt": "string",
  "startedAt": "string",
  "endedAt": "string",
  "comments": "string",
  "exercises": [
    {
      "id": "uuid",
      "exerciseId": "uuid",
      "sequence": "number",
      "sets": "number",
      "reps": "number",
      "weight": "number",
      "weightUnit": "KG | LBS",
      "duration": "number",
      "isCompleted": "boolean"
    }
  ]
}
```

## Exercises

### Category Output

```json
{
  "id": "uuid",
  "name": "string"
}
```

### Exercise Input

```json
{
  "name": "string",
  "categoryId": "uuid",
  "description": "string",
  "muscleGroup": "string"
}
```

### Exercise Output

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "isSystem": "boolean",
  "categoryId": "uuid",
  "muscleGroup": "string"
}
```

## Measurements

### Measurement Input/Update

```json
{
  "weight": "number",
  "date": "ISO-8601 string",
  "notes": "string"
}
```

### Measurement Output

```json
{
  "id": "uuid",
  "weight": "number",
  "date": "string",
  "notes": "string"
}
```

## Reports

### Report Input

```json
{
  "startDate": "ISO-8601 string",
  "endDate": "ISO-8601 string"
}
```

### Report Output

```json
{
  "workoutSummary": {
    "totalWorkouts": "number",
    "totalDuration": "number",
    "categoryBreakdown": {
      "categoryName": "number"
    }
  },
  "weightProgress": [
    {
      "id": "uuid",
      "weight": "number",
      "date": "string"
    }
  ]
}
```
