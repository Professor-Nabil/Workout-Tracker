# Read all plans for one user

- Method: GET
- Path: `/api/plans`
- headers.authorization: `Bearer accessToken`

---

- Response Success:
  - Status code: 200
  - Body:

  ```json
  {
    "message": "Success read many plans for one usre",
    "data": {
      "user": {
        "id": "ed19c252-dcbe-4e84-9fd7-5f7235aab65e"
      },
      "plans": [
        {
          "id": "11e7f7ab-5903-43ed-8739-20c7815a5696",
          "title": "Oscar and Lucinda",
          "userId": "ed19c252-dcbe-4e84-9fd7-5f7235aab65e",
          "planExercise": [
            {
              "id": "39f70107-d1c4-4109-b979-3fbda1d28b67",
              "weight": 20, // || undefined
              "period": 90, // || undefined
              "sets": 4, // || undefined
              "reps": 10, // || undefined
              "planId": "11e7f7ab-5903-43ed-8739-20c7815a5696",
              "exerciseId": "2c652032-1d02-49cd-95e8-222302771d93"
            },
            {
              "id": "e2bd63e2-57ed-417a-89e0-0465dc0f9e17",
              "weight": 30, // || undefined
              "period": 90, // || undefined
              "sets": 4, // || undefined
              "reps": 10, // || undefined
              "planId": "11e7f7ab-5903-43ed-8739-20c7815a5696",
              "exerciseId": "42097cdc-7e51-43dc-b102-d286803ddd18"
            },
            {
              "id": "e4fa1f28-9fdd-44e5-a00a-7312cfe24f98",
              "weight": 40, // || undefined
              "period": 90, // || undefined
              "sets": 4, // || undefined
              "reps": 10, // || undefined
              "planId": "11e7f7ab-5903-43ed-8739-20c7815a5696",
              "exerciseId": "75aec4d6-f655-4d65-8354-4f9c3c15120e"
            }
          ]
        },
        {
          "id": "dc9651d3-dd72-4926-8616-9c9a11343741",
          "title": "Tristram Shandy",
          "userId": "ed19c252-dcbe-4e84-9fd7-5f7235aab65e",
          "planExercise": [
            {
              "id": "008e5f80-6923-4d11-8656-13f1ec1af66a",
              "weight": 40, // || undefined
              "period": 90, // || undefined
              "sets": 4, // || undefined
              "reps": 10, // || undefined
              "planId": "dc9651d3-dd72-4926-8616-9c9a11343741",
              "exerciseId": "75aec4d6-f655-4d65-8354-4f9c3c15120e"
            },
            {
              "id": "1584351d-5998-4208-be32-2f1d04f4dc77",
              "weight": 30, // || undefined
              "period": 90, // || undefined
              "sets": 4, // || undefined
              "reps": 10, // || undefined
              "planId": "dc9651d3-dd72-4926-8616-9c9a11343741",
              "exerciseId": "42097cdc-7e51-43dc-b102-d286803ddd18"
            },
            {
              "id": "35b35ebf-6d7e-4f8c-9ecc-e2ec98dc9b4a",
              "weight": 20, // || undefined
              "period": 90, // || undefined
              "sets": 4, // || undefined
              "reps": 10, // || undefined
              "planId": "dc9651d3-dd72-4926-8616-9c9a11343741",
              "exerciseId": "2c652032-1d02-49cd-95e8-222302771d93"
            }
          ]
        }
      ]
    }
  }
  ```

---

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
