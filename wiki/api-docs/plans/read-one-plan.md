# Read one plan for one user

- Method: GET
- Path: `/api/plans/:planId`
- headers.authorization: `Bearer accessToken`

---

- Response Success:
  - Status code: 201
  - Body:

  ```json
  {
    "message": "Success read one plan",
    "data": {
      "user": {
        "id": "a0cd2f2f-b2ab-4534-a036-84d0c2f39ddf"
      },
      "plan": {
        "id": "ab86013c-b2ed-4cbc-bcfb-52499d2ca909",
        "title": "Hypertrophy Push Day",
        "userId": "a0cd2f2f-b2ab-4534-a036-84d0c2f39ddf",
        "planExercise": [
          {
            "id": "64e02cb6-e5cb-459d-b2a7-98ff34a499af",
            "weight": 10, // || undefined
            "period": 20, // || undefined
            "sets": 4, // || undefined
            "reps": 8, // || undefined
            "planId": "ab86013c-b2ed-4cbc-bcfb-52499d2ca909",
            "exerciseId": "2c652032-1d02-49cd-95e8-222302771d93"
          }
        ]
      }
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
