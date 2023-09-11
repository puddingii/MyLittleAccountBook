import express, { Request } from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import { verifyToken } from '@/middleware/authentication';
import { createAccountBookAndInviteUser } from '@/service/headerService';

/** Interface */
import { TPostAccountBook } from '@/interface/api/response/headerResponse';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
	try {
		const { body: info } = await zParser(zodSchema.header.postAccountBook, req);

		const accountBookId = await createAccountBookAndInviteUser({
			...info,
			ownerEmail: (req.user as Exclude<Request['user'], undefined>).email,
		});

		return res.status(200).json({
			data: { accountBookId },
			message: '',
			status: 'success',
		} as TPostAccountBook);
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
