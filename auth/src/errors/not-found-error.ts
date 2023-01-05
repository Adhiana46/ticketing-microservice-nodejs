import CustomError from "./custom-error";

export default class NotFoundError extends CustomError {
  constructor() {
    super("NotFoundError");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  statusCode(): number {
    return 404;
  }
  serializeError(): { message: string; field?: string }[] {
    return [{ message: "Not Found" }];
  }
}
