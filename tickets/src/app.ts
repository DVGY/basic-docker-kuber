import express from 'express';
import cookieParser from 'cookie-parser';

import ticketsRoutes from './routes/ticketsRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());
app.use(cookieParser('my-cookie-secret'));

// app.use((req, res, next) => {
//   console.log({ cookie: req.cookies });
//   next();
// });

app.use('/api/tickets', ticketsRoutes);

app.use(errorHandler);

export { app };
