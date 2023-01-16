import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@adhiana-ticketing/common";
import {
  createTicketRouter,
  showTicketRouter,
  showAllTicketRouter,
  updateTicketRouter,
} from "./routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption, because we store jwt
    secure: process.env.NODE_ENV !== "test", // must https
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(showAllTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
