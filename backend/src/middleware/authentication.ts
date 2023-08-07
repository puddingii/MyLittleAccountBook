import { NextFunction, Request, Response } from 'express';

import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import { decodeToken, isExpiredToken } from '@/util/jwt';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			headers: { authorization },
			cookies: { refresh },
		} = req;

		const accessToken = (authorization ?? '').split(' ')[1];
		const isExpiredAccessToken = isExpiredToken(accessToken);
		const isExpiredRefreshToken = isExpiredToken(refresh);

		/** Refresh token X or Access token X */
		if (isExpiredAccessToken || isExpiredRefreshToken) {
			throw new Error('로그인이 필요합니다.');
		}

		/** Refresh token O and Access token O */
		const userInfo = decodeToken<{ email: string; nickname: string }>(accessToken);
		if (!userInfo) {
			throw new Error('만료된 토큰입니다.');
		}
		req.user = userInfo;
		next();
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, {
			trace: 'Middleware',
		});
		logger.error(message, traceList);
		return res.status(401).send({ isSuccess: false });
	}
};
