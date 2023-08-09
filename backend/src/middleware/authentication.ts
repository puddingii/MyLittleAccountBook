import { NextFunction, Request, Response } from 'express';

import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import { decodeToken, isExpiredToken } from '@/util/jwt';
import zParser from '@/util/parser';
import { deleteCache, getCache } from '@/util/cache';
import { TDecodedAccessTokenInfo } from '@/interface/auth';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			headers: { authorization, refresh },
		} = await zParser(zodSchema.auth.tokenInfo, req);

		const accessToken = (authorization ?? '').split(' ')[1];
		const isExpiredAccessToken = isExpiredToken(accessToken);
		const isExpiredRefreshToken = isExpiredToken(refresh);

		/** Refresh token X or Access token X */
		if (isExpiredAccessToken && isExpiredRefreshToken) {
			throw new Error('로그인이 필요합니다.');
		}

		/** Decoded access token data checking */
		const userInfo = decodeToken<TDecodedAccessTokenInfo | null>(accessToken);
		if (!userInfo) {
			throw new Error('만료된 토큰입니다.');
		}

		/** Client refresh token, Server refresh token is required to same */
		const cachedRefreshToken = await getCache(userInfo.email);
		if (cachedRefreshToken !== refresh) {
			await deleteCache(userInfo.email);
			throw new Error('로그인이 필요합니다.');
		}

		req.user = userInfo;
		next();
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Middleware',
			code: 401,
		});
		logger.error(message, traceList);
		return res.status(code).send({ data: {}, status: 'fail', message });
	}
};
