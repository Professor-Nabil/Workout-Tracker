export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly errors: any;
  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, errors?: any) {
    super(message, 409, errors);
  }
}

export class BadRequest extends AppError {
  constructor(message: string, errors?: any) {
    super(message, 400, errors);
  }
}
