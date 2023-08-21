import { Express } from 'express';
import userRouter from '@/router/userRouter';
import authRouter from '@/router/authRouter';
import spendingIncomeRouter from '@/router/spendingIncomeRouter';

export default (app: Express) => {
	app.use('/user', userRouter);
	app.use('/auth', authRouter);
	app.use('/accountbook/spending-income', spendingIncomeRouter);
};
