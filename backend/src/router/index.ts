import { Express } from 'express';
import userRouter from '@/router/userRouter';
import authRouter from '@/router/authRouter';
import accountBookRouter from '@/router/accountBookRouter';

export default (app: Express) => {
	app.use('/user', userRouter);
	app.use('/auth', authRouter);
	app.use('/account-book', accountBookRouter);
};
