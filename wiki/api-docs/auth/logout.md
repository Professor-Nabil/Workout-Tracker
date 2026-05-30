# user logout --> delete refreshToken form database

- Method: POST
- Path: `/api/auth/logout`
- body:

```json
{
  "refreshToken": "long-token"
}
```

- Response Success:
  - Status code: 204
