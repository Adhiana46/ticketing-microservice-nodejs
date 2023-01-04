import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError, DatabaseConnectionError } from "../errors";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    console.log("Creating a User...");

    throw new DatabaseConnectionError();

    res.send("POST /api/users/signup");
  }
);

export default router;
