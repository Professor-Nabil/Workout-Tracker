# Environment Variables

```bash
echo ".env" >> .gitignore
```

```bash
DATABASE_URL="mysql://admin:your_password@localhost:3306/auth_db"
DATABASE_HOST="localhost"
DATABASE_USER="admin"
DATABASE_PASSWORD="your_password"
DATABASE_NAME="auth_db"
DATABASE_PORT=3306

PORT=3000
JWT_ACCESS_SECRET="your_long_random_string_at_least_32_chars"
JWT_REFRESH_SECRET="your_long_random_secret_at_least_32_chars"
NODE_ENV="development"
```
