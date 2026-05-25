# refresh user session

- Method: POST
- Path: `/api/auth/refresh`
- body:

```json
{
  "refreshToken": "long-token"
}
```

- Response Success:
  - Status code: 200
  - Body:

  ```json
  {
    "message": "Success refreshToken",
    "data": {
      "accessToken": "long-token",
      "refreshToken": "long-token"
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
