# UPDATE a specific plan completely by its ID

- Method: PUT
- Path: `/api/plans/:planId`
- headers.authorization: `Bearer accessToken`
- body:

```json
{
  "title": "Optimized Hypertrophy Push Day v2",
  "planExercises": [
    {
      "exerciseId": "realExercises[0]!.id",
      "weight": 25,
      "period": 60,
      "sets": 4,
      "reps": 12
    },
    {
      "exerciseId": "realExercises[2]!.id",
      "weight": 45,
      "period": 45,
      "sets": 3,
      "reps": 8
    }
  ]
}
```

---

- Response Success:
  - Status code: 200
  - Body:

  ```json
  {
    "message": "Success update plan",
    "data": {
      "id": "9216a743-218a-4dbb-b811-6ccbe3182da2",
      "title": "Optimized Hypertrophy Push Day v2",
      "userId": "6fa1c185-4e5a-40ee-a838-af599ee5fe2a",
      "planExercise": [
        {
          "id": "46dcd7b4-9251-4bfa-b9d5-9937b395edf0",
          "weight": 25,
          "period": 60,
          "sets": 4,
          "reps": 12,
          "planId": "9216a743-218a-4dbb-b811-6ccbe3182da2",
          "exerciseId": "2c652032-1d02-49cd-95e8-222302771d93"
        },
        {
          "id": "cecf9cae-e0a5-43fa-859d-ee745ff7cf48",
          "weight": 45,
          "period": 45,
          "sets": 3,
          "reps": 8,
          "planId": "9216a743-218a-4dbb-b811-6ccbe3182da2",
          "exerciseId": "75aec4d6-f655-4d65-8354-4f9c3c15120e"
        }
      ]
    }
  }
  ```

---

- Response failed:
  - Status code: 400 || 401
  - Body:

  ```json
    {
      "status": "fail || error",
      "message": "Invalid plan",
      "errors": [],
    });
  ```
