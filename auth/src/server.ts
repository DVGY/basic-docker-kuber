import mongoose from 'mongoose';
import { app } from './app';

if (!process.env.JWT_SECRET_KEY) {
  throw new Error('JWT SECRET KEY is not defined');
}
if (!process.env.MONGO_URI) {
  throw new Error('MONGO URI is not defined');
}
console.log('Starting auth srv...');
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB Connected Successfully !!'))
  .catch((err) => {
    console.log(err);
    throw err;
  });

app.listen(3000, () => console.log('Listeninig on port 3000!!'));
