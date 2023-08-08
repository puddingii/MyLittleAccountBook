import express from 'express';

import {
	emailLogin,
	googleLogin,
	getSocialLoginLocation,
	naverLogin,
	refreshToken,
} from '@/service/authService';
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import secret from '@/config/secret';

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

		return res.status(200).json(tokenInfo);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, { trace: 'Router' });
		logger.error(message, traceList);
		return res.status(403).redirect(secret.frontUrl);
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

		return res.status(200).json(tokenInfo);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, { trace: 'Router' });
		logger.error(message, traceList);
		return res.status(403).json({ isSucceed: false, message });
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
		const { message, traceList } = convertErrorToCustomError(error, { trace: 'Router' });
		logger.error(message, traceList);
		return res.status(403).json({ isSucceed: false, message });
	}
});

router.post('/email', async (req, res) => {
	try {
		console.log(req.body);
		const {
			body: { email, password },
		} = await zParser(zodSchema.auth.emailLogin, req);

		const tokenInfo = await emailLogin({ email, password });

		return res.status(200).json(tokenInfo);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, { trace: 'Router' });
		logger.error(message, traceList);
		return res.status(403).json({ isSucceed: false, message });
	}
});

router.get('/refresh', async (req, res) => {
	try {
		const {
			cookies: { refresh },
			headers: { authorization },
		} = await zParser(zodSchema.auth.refresh, req);

		const accessToken = authorization.split(' ')[1];
		const newAccessToken = await refreshToken(refresh, accessToken);

		return res.status(200).json(newAccessToken);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, { trace: 'Router' });
		logger.error(message, traceList);
		return res.status(403).json({ isSucceed: false, message });
	}
});

export default router;
