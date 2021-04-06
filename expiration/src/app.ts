import express from 'express';

import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());

// app.use((req, res, next) => {
//   console.log({ cookie: req.cookies });
//   next();
// });

app.use(errorHandler);

export { app };
