import express from 'express';
import cookieParser from 'cookie-parser';

import ordersRoutes from './routes/ordersRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());
app.use(cookieParser('my-cookie-secret'));

// app.use((req, res, next) => {
//   console.log({ cookie: req.cookies });
//   next();
// });

app.use('/api/orders', ordersRoutes);

app.use(errorHandler);

export { app };
