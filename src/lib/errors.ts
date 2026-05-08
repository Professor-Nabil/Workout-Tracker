export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Invalid credentials") {
    super(message, 401);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
