import express from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import { verifyToken } from '@/middleware/authentication';
import { getUserInfo } from '@/service/userService';

/** Interface */
import { TGet } from '@/interface/api/response/userResponse';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const {
			query: { email, nickname },
		} = await zParser(zodSchema.user.getUser, req);

		const result = await getUserInfo({ email, nickname });

		return res.status(200).json({
			data: result,
			message: '',
			status: 'success',
		} as TGet);
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
