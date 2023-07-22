import { Express } from 'express';
import userRouter from '@/router/userRouter';

export default (app: Express) => {
	app.use('/user', userRouter);
};
