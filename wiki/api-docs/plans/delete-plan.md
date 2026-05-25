# DELETE a specific plan by its ID

- Method: DELETE
- Path: `/api/plans/:planId`
- headers.authorization: `Bearer accessToken`

---

- Response Success:
  - Status code: 204

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
