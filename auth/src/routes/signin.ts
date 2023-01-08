import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { RequestValidationError, BadRequestError } from "../errors";
import { User } from "../model";
import { Password } from "../services";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password must provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if user with email exists
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const passwordValid = await Password.compare(user.password, password);

    if (!passwordValid) {
      throw new BadRequestError("Invalid email or password");
    }

    // generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // store on session object (cookie)
    req.session = {
      jwt: userJwt,
    };

    return res.status(200).send(user);
  }
);

export default router;
