import CustomError from "./custom-error";

export default class NotAuthorizeError extends CustomError {
  constructor() {
    super("NotAuthorizeError");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorizeError.prototype);
  }

  statusCode(): number {
    return 401;
  }
  serializeError(): { message: string; field?: string }[] {
    return [{ message: "Not Authorized" }];
  }
}
