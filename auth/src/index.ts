import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";

import currentUserRouter from "./routes/current-user";
import signin from "./routes/signin";
import signup from "./routes/signup";
import signout from "./routes/signout";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signin);
app.use(signup);
app.use(signout);

mongoose
  .connect("mongodb://auth-mongo-srv:27017/auth", {
    useNewUrlParser: true,
    useCreateIndex: true,

    useFindAndModify: false,
  })
  .then(() => console.log("DB Connected Successfully !!"));

app.listen(3000, () => console.log("Listeninig on port 3000!!"));
