import mongoose from "mongoose";
import { app } from "./app";

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT SECRET KEY is not defined");
}

mongoose
  .connect("mongodb://auth-mongo-srv:27017/auth", {
    useNewUrlParser: true,
    useCreateIndex: true,

    useFindAndModify: false,
  })
  .then(() => console.log("DB Connected Successfully !!"));

app.listen(3000, () => console.log("Listeninig on port 3000!!"));
