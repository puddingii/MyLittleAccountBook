import { Express } from 'express';
import userRouter from '@/router/userRouter';
import authRouter from '@/router/authRouter';

export default (app: Express) => {
	app.use('/user', userRouter);
	app.use('/auth', authRouter);
};
