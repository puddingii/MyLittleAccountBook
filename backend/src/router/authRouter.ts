import express, { Request } from 'express';

import {
	emailLogin,
	googleLogin,
	getSocialLoginLocation,
	naverLogin,
	refreshToken,
	emailJoin,
	deleteToken,
	resendVerificationEmail,
	verifyEmail,
} from '@/service/authService/dependency';
import { verifyToken } from '@/middleware/authentication';

import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

import {
	TGetToken,
	TGetSocialGoogle,
	TGetSocialNaver,
	TPostEmail,
	TPostJoin,
	TDeleteToken,
	TGetSocial,
	TVerifyemail,
	TResendEmail,
} from '@/interface/api/response/authResponse';

const router = express.Router();

router.post('/social/google', async (req, res) => {
	try {
		const {
			body: { code, error, state },
		} = await zParser(zodSchema.auth.googleLogin, req);

		if ((error && !code) || !code) {
			throw error;
		}

		const tokenInfo = await googleLogin({ code, state });

		return res.status(200).json({
			data: tokenInfo,
			message: '',
			status: 'success',
		} satisfies TGetSocialGoogle);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.post('/social/naver', async (req, res) => {
	try {
		const {
			body: { code, error, error_description: errorDescription, state },
		} = await zParser(zodSchema.auth.naverLogin, req);

		if (error || !code) {
			throw new Error(errorDescription, { cause: error });
		}

		const tokenInfo = await naverLogin({ code, state });

		return res.status(200).json({
			data: tokenInfo,
			message: '',
			status: 'success',
		} satisfies TGetSocialNaver);
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

		return res
			.status(200)
			.json({ data: { location }, message: '', status: 'success' } satisfies TGetSocial);
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
			.json({ data: tokenInfo, message: '', status: 'success' } satisfies TPostEmail);
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
			.json({ data: {}, message: '', status: 'success' } satisfies TPostJoin);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.get('/token', async (req, res) => {
	try {
		const {
			headers: { authorization, refresh },
		} = await zParser(zodSchema.auth.tokenInfo, req);

		const accessToken = authorization.split(' ')[1];
		const newAccessToken = await refreshToken({
			accessToken,
			refreshToken: refresh,
		});

		return res.status(200).json({
			data: { accessToken: newAccessToken },
			message: '',
			status: 'success',
		} satisfies TGetToken);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 401,
		});
		logger.error(message, traceList);

		return res.status(code).json({
			data: {},
			message,
			status: 'fail',
		});
	}
});

router.delete('/token', async (req, res) => {
	try {
		const {
			headers: { authorization, refresh },
		} = await zParser(zodSchema.auth.tokenInfo, req);

		const accessToken = authorization.split(' ')[1];
		await deleteToken({ refreshToken: refresh, accessToken });

		return res.status(200).json({
			data: {},
			message: '',
			status: 'success',
		} satisfies TDeleteToken);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({
			data: {},
			message,
			status: 'fail',
		});
	}
});

/** State값 및 유저 정보로 이메일 인증. */
router.patch('/email/verify', async (req, res) => {
	try {
		const {
			body: { emailState, userEmail },
		} = await zParser(zodSchema.auth.verifyEmail, req);

		const result = await verifyEmail({ userEmail, emailState });

		return res.status(200).json({
			data: { code: result.code },
			message: '',
			status: 'success',
		} satisfies TVerifyemail);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({
			data: {},
			message,
			status: 'fail',
		});
	}
});

/** 인증되지 않는 유저에게 인증이메일 다시 보내기 */
router.post('/email/resend', verifyToken, async (req, res) => {
	try {
		const { email, nickname } = req.user as Exclude<Request['user'], undefined>;

		const result = await resendVerificationEmail({
			userEmail: email,
			userNickname: nickname,
		});

		return res.status(200).json({
			data: { code: result.code },
			message: result.message,
			status: 'success',
		} satisfies TResendEmail);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({
			data: {},
			message,
			status: 'fail',
		});
	}
});

export default router;
