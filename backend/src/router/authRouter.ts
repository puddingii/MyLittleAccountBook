import express from 'express';

import {
	emailLogin,
	googleLogin,
	getSocialLoginLocation,
	naverLogin,
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
		return res.status(403).json({ isSucceed: false });
	}
});

router.get('/social', async (req, res) => {
	try {
		const {
			query: { type },
		} = await zParser(zodSchema.auth.socialLogin, req);
		const location = await getSocialLoginLocation(type);

		return res.status(301).redirect(location);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, { trace: 'Router' });
		logger.error(message, traceList);
		return res.status(404).json({ isSucceed: false });
	}
});

router.get('/email', async (req, res) => {
	try {
		const result = await emailLogin();
		return res.status(200).json(result);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, { trace: 'Router' });
		logger.error(message, traceList);
		return res.status(404).json({ isSucceed: false });
	}
});

export default router;
