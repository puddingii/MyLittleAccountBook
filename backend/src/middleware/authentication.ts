import { NextFunction, Request, Response } from 'express';
import { logger } from '@/util';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	logger.info('hello', ['Middleware']);
	// 401 Unauthorized
	next();
};
