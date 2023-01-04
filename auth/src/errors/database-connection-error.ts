import CustomError from "./custom-error";

export default class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database";

  constructor() {
    super("DatabaseConnectionError");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  statusCode(): number {
    return 500;
  }

  serializeError(): { message: string; field?: string }[] {
    return [{ message: this.reason }];
  }
}
