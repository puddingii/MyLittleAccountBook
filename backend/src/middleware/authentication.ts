import { NextFunction, Request, Response } from 'express';

import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import { decodeToken, isExpiredToken } from '@/util/jwt';
import zParser from '@/util/parser';
import {
	deleteRefreshTokenCache as deleteCache,
	getRefreshTokenCache as getCache,
} from '@/util/cache/v2';
import { CustomError } from '@/util/error/class';

import { TDecodedAccessTokenInfo } from '@/interface/auth';
import { findUserPrivacy } from '@/repository/userPrivacyRepository/dependency';

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
		const userInfo = decodeToken<TDecodedAccessTokenInfo>(accessToken);
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

/** 앞에 Middleware verifyToken함수를 먼저 불러주고 사용해야함 */
export const checkEmailValidation = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const myInfo = req.user;
		if (!myInfo) {
			throw new Error('로그인이 필요합니다');
		}
		const userPrivacy = await findUserPrivacy({ userEmail: myInfo.email });
		if (!userPrivacy) {
			/** UP === user privacy */
			throw new CustomError('DB Error(UP table is not existed)', { code: 500 });
		}

		if (!userPrivacy.isAuthenticated) {
			throw new Error(
				'로그인된 계정은 인증되지 않은 이메일입니다. 해당 서비스를 이용하기 위해 이메일 인증을 먼저 해주십시요.',
			);
		}

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
