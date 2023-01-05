import CustomError from "./custom-error";

export default class BadRequestError extends CustomError {
  constructor(public message: string) {
    super(message);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  statusCode(): number {
    return 400;
  }

  serializeError(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
