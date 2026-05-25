# User login to get new access token and refresh token

- Method: POST
- Path: `/api/auth/login`
- body:

```json
{
  "email": "user1@email.com",
  "password": "userPassword"
}
```

- Response Success:
  - Status code: 200
  - Body:

  ```json
  {
    "message": "Success login",
    "data": {
      "user": {
        "id": "long-uuid",
        "email": "user1@email.com"
      },
      "accessToken": "long-token",
      "refreshToken": "long-token"
    }
  }
  ```

- Response failed:
  - Status code: 400
  - Body:

  ```json
    {
      "status": "fail || error",
      "message": "Bad Resuest",
      "errors": [],
    });
  ```
