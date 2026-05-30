# Create new plan

## You can

- **_ Create Plan _** with one nested Exercise
- **_ Create Plan _** with multiple nested Exercises
- **_ Create Plan _** with Hybrid Exercises (Cardio + Strength)

## How it works

- Method: POST
- Path: `/api/plans`
- headers.authorization: `Bearer accessToken`
- body:

```json
{
  "title": "Hybrid Strength & Cardio Routine",
  "userId": "realUser.id",
  "planExercises": [
    {
      "exerciseId": "realExercise[0]!.id",
      "weight": 100, // 100 kg
      "sets": 4,
      "reps": 5
      // period: undefined,
    },
    {
      "exerciseId": "realExercise[1]!.id",
      // weight: undefined,
      // sets: undefined,
      // reps: undefined,
      "period": 20 // 20 minutes running
    }
  ]
}
```

- Response Success:
  - Status code: 201
  - Body:

  ```json
  {
    "message": "Created plan succussfully",
    "data": {
      "userId": "long-uuid",
      "planId": "long-uuid"
    }
  }
  ```

- Response failed:
  - Status code: 401
  - Body:

  ```json
    {
      "status": "fail || error",
      "message": "Invalid token payload",
      "errors": [],
    });
  ```
