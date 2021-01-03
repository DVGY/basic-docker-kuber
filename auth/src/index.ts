import express from "express";
import mongoose from "mongoose";

import currentUserRouter from "./routes/current-user";
import signin from "./routes/signin";
import signup from "./routes/signup";
import signout from "./routes/signout";
import { errorHandler } from "./utils/errorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log({ cookie: req.cookies });
//   next();
// });

app.use(currentUserRouter);
app.use(signin);
app.use(signup);
app.use(signout);

app.use(errorHandler);
if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT SECRET KEY is not defined");
}
// new AppError("Unable to run app", 18);
mongoose
  .connect("mongodb://auth-mongo-srv:27017/auth", {
    useNewUrlParser: true,
    useCreateIndex: true,

    useFindAndModify: false,
  })
  .then(() => console.log("DB Connected Successfully !!"));

app.listen(3000, () => console.log("Listeninig on port 3000!!"));
