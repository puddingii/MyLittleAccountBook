import express from 'express';

import { emailLogin, googleLogin, getSocialLoginLocation } from '@/service/authService';
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

const router = express.Router();

router.get('/social/google', async (req, res) => {
	try {
		console.log(req.query);
		const {
			query: { code, error },
		} = await zParser(zodSchema.auth.googleLogin, req);
		return res.status(200).json({ isSuccess: true });
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error);
		logger.error(message, traceList);
		return res.status(404).json({ isSucceed: false });
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
		const { message, traceList } = convertErrorToCustomError(error);
		logger.error(message, traceList);
		return res.status(404).json({ isSucceed: false });
	}
});

router.get('/email', async (req, res) => {
	try {
		const result = await emailLogin();
		return res.status(200).json(result);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error);
		logger.error(message, traceList);
		return res.status(404).json({ isSucceed: false });
	}
});

export default router;
