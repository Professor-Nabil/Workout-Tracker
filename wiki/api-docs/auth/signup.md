# Create New User

- Method: POST
- Path: `/api/auth/signup`
- body:

```json
{
  "email": "user1@email.com",
  "password": "userPassword"
}
```

- Response Success:
  - Status code: 201
  - Body:

  ```json
  {
    "message": "Success signup",
    "data": {
      "user": {
        "id": "long-uuid",
        "email": "user1@email.com"
      }
    }
  }
  ```

- Response failed:
  - Status code: 400 || 409
  - Body:

  ```json
    {
      "status": "fail || error",
      "message": "Conflect Error || Bad Resuest",
      "errors": [],
    });
  ```
