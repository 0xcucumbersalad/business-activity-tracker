export class PublicError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends PublicError {
  constructor() {
    super("Resource not found");
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to use this api");
    this.name = "AuthenticationError";
  }
}
