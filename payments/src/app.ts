import express from 'express';
import cookieParser from 'cookie-parser';

import paymentsRoutes from './routes/paymentsRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());
app.use(cookieParser('my-cookie-secret'));

// app.use((req, res, next) => {
//   console.log({ cookie: req.cookies });
//   next();
// });
app.use('/api/payments', paymentsRoutes);

app.use(errorHandler);

export { app };
