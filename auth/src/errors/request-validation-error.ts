import { ValidationError } from "express-validator";
import CustomError from "./custom-error";

export default class RequestValidationError extends CustomError {
  constructor(public errors: ValidationError[]) {
    super("RequestValidationError");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  statusCode(): number {
    return 400;
  }

  serializeError(): { message: string; field?: string }[] {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
