import express from "express";

import currentUserRouter from "./routes/current-user";
import signin from "./routes/signin";
import signup from "./routes/signup";
import signout from "./routes/signout";
import { errorHandler } from "./utils/errorHandler";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser("my-cookie-secret"));

// app.use((req, res, next) => {
//   console.log({ cookie: req.cookies });
//   next();
// });

app.use(currentUserRouter);
app.use(signin);
app.use(signup);
app.use(signout);

app.use(errorHandler);

export { app };
