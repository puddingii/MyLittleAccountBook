import express, { Request } from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import { verifyToken } from '@/middleware/authentication';
import {
	getUserInfo,
	updateUserInfoAndRefreshToken,
} from '@/service/userService/dependency';

/** Interface */
import { TGet, TPatch } from '@/interface/api/response/userResponse';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const { query: info } = await zParser(zodSchema.user.getUser, req);
		const myInfo = req.user as Exclude<Request['user'], undefined>;

		const result = await getUserInfo({ ...info, myEmail: myInfo.email });

		return res.status(200).json({
			data: result,
			message: '',
			status: 'success',
		} satisfies TGet);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.patch('/', verifyToken, async (req, res) => {
	try {
		const {
			body: info,
			headers: { authorization, refresh: refreshToken },
		} = await zParser(zodSchema.user.patchUser, req);

		const accessToken = (authorization ?? '').split(' ')[1];
		const result = await updateUserInfoAndRefreshToken({
			...info,
			accessToken,
			refreshToken,
			email: (req.user as Exclude<Request['user'], undefined>).email,
		});

		return res.status(200).json({
			data: result,
			message: '',
			status: 'success',
		} satisfies TPatch);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

export default router;
