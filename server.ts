import dotenv from 'dotenv';
dotenv.config();

import { registerValidations } from './validations/register';
import { UserCtrl } from './controllers/UserController';
import express from 'express';
import './core/db';

const app = express();

app.use(express.json());

app.get('/users', UserCtrl.index);
app.get('/users/verify', registerValidations, UserCtrl.verify);
app.post('/users', registerValidations, UserCtrl.create);
// app.patch('/users', UserCtrl.update);
// app.delete('/users', UserCtrl.delete);

app.listen(process.env.PORT || 8888, (): void => {
  console.log('Server is running');
});
