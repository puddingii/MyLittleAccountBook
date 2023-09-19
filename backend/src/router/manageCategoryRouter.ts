import express from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import { addCategory, getCategoryList } from '@/service/manageCategory';
import { verifyToken } from '@/middleware/authentication';

/** Interface */
import { TGet, TPost } from '@/interface/api/response/manageCategoryResponse';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const {
			query: { accountBookId },
		} = await zParser(zodSchema.manageCategory.getCategory, req);

		const list = await getCategoryList({ accountBookId: parseInt(accountBookId, 10) });

		return res.status(200).json({
			data: list,
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

router.post('/', verifyToken, async (req, res) => {
	try {
		const { body: info } = await zParser(zodSchema.manageCategory.postCategory, req);

		const result = await addCategory(info);

		return res.status(200).json({
			data: result,
			message: '',
			status: 'success',
		} as TPost);
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
