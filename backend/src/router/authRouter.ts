import express from 'express';

import {
	emailLogin,
	googleLogin,
	getSocialLoginLocation,
	naverLogin,
	refreshToken,
	emailJoin,
} from '@/service/authService';
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

import {
	TGetRefresh,
	TGetSocialGoogle,
	TGetSocialNaver,
	TPostEmail,
	TPostJoin,
} from '@/interface/api/authResponse';

const router = express.Router();

router.get('/social/google', async (req, res) => {
	try {
		const {
			query: { code, error, state },
		} = await zParser(zodSchema.auth.googleLogin, req);

		if ((error && !code) || !code) {
			throw error;
		}

		const tokenInfo = await googleLogin(code, state);

		return res
			.status(200)
			.json({ data: tokenInfo, message: '', status: 'success' } as TGetSocialGoogle);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.get('/social/naver', async (req, res) => {
	try {
		const {
			query: { code, error, error_description: errorDescription, state },
		} = await zParser(zodSchema.auth.naverLogin, req);

		if (error || !code) {
			throw new Error(errorDescription, { cause: error });
		}

		const tokenInfo = await naverLogin(code, state);

		return res
			.status(200)
			.json({ data: tokenInfo, message: '', status: 'success' } as TGetSocialNaver);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.get('/social', async (req, res) => {
	try {
		const {
			query: { type },
		} = await zParser(zodSchema.auth.socialLogin, req);
		const location = await getSocialLoginLocation(type);

		return res.status(302).redirect(location);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.post('/email', async (req, res) => {
	try {
		const {
			body: { email, password },
		} = await zParser(zodSchema.auth.emailLogin, req);

		const tokenInfo = await emailLogin({ email, password });

		return res
			.status(200)
			.json({ data: tokenInfo, message: '', status: 'success' } as TPostEmail);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.post('/join', async (req, res) => {
	try {
		const {
			body: { email, password, nickname },
		} = await zParser(zodSchema.auth.join, req);

		await emailJoin({ email, password, nickname });

		return res
			.status(201)
			.json({ data: {}, message: '', status: 'success' } as TPostJoin);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.get('/refresh', async (req, res) => {
	try {
		const {
			headers: { authorization, refresh },
		} = await zParser(zodSchema.auth.tokenInfo, req);

		const accessToken = authorization.split(' ')[1];
		const newAccessToken = await refreshToken(refresh, accessToken);

		return res.status(200).json({
			data: { accessToken: newAccessToken },
			message: '',
			status: 'success',
		} as TGetRefresh);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 401,
		});
		logger.error(message, traceList);

		return res.status(code).json({
			data: {},
			message: '',
			status: 'fail',
		});
	}
});

export default router;
