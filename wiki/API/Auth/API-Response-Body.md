```js

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 409 if user already exists
{ status: 'fail', message: 'Email already exists' }

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if email or password is missing
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [
    { faild: 'email', message: 'Email is required' },
    { faild: 'password', message: 'Password is required' }
  ]
}
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { faild: 'password', message: 'Password is required' } ]
}
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { faild: 'email', message: 'Email is required' } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if password short
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { faild: 'email', message: 'Invalid email format' } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if password short
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { faild: 'email', message: 'Invalid email format' } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if password short
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { faild: 'email', message: 'Invalid email format' } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if password short
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { faild: 'email', message: 'Invalid email format' } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if password short
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { faild: 'email', message: 'Invalid email format' } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if password short
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { faild: 'email', message: 'Invalid email format' } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if password short
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [
    {
      faild: 'password',
      message: 'Password must be at least 8 characters long'
    }
  ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if Content-Type in not application/json
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { message: 'Required' } ]
}
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { message: 'Required' } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should ignore extra fieleds and not save them to the database
{
  status: 'fail',
  message: 'Validation Failed',
  errors: [ { message: "Unrecognized key(s) in object: 'role', 'hacker'" } ]
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if JSON body is malformed
{
  status: 400,
  message: "Expected ':' after property name in JSON at position 37 (line 1 column 38)"
}

// stdout | tests/e2e/auth/signup.test.ts > Test API POST /auth > Should return 400 if fields are excessively long
{
  status: 'error',
  message: '\n' +
    'Invalid `db.user.create()` invocation in\n' +
    '/home/nabil/Github_Nabil_Tester/Workout-Tracker/src/services/auth.service.ts:9:30\n' +
    '\n' +
    '  6 export const signupService = async (email: string, password: string) => {\n' +
    '  7   const hashedPassword = await bcrypt.hash(password, 12);\n' +
    '  8 \n' +
    '→ 9   const user = await db.user.create(\n' +
    "The provided value for the column is too long for the column's type. Column: email"
}
```
