import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError, BadRequestError } from "../errors";
import { User } from "../model";

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

    const { email, password } = req.body;

    // Check if email already in use
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    // store to db
    const user = User.build({
      email: email,
      password: password,
    });
    await user.save();

    return res.status(201).send(user);
  }
);

export default router;
