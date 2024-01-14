import express, { Request } from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import {
	addCategory,
	deleteCategory,
	getCategoryList,
	updateCategoryInfo,
} from '@/service/manageCategory/dependency';
import { checkEmailValidation, verifyToken } from '@/middleware/authentication';

/** Interface */
import {
	TDelete,
	TGet,
	TPatch,
	TPost,
} from '@/interface/api/response/manageCategoryResponse';

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

router.post('/', verifyToken, checkEmailValidation, async (req, res) => {
	try {
		const { body: info } = await zParser(zodSchema.manageCategory.postCategory, req);

		const result = await addCategory({
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
			...info,
		});

		return res.status(200).json({
			data: result,
			message: '',
			status: 'success',
		} satisfies TPost);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.patch('/', verifyToken, checkEmailValidation, async (req, res) => {
	try {
		const { body: info } = await zParser(zodSchema.manageCategory.patchCategory, req);

		await updateCategoryInfo({
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
			...info,
		});

		return res.status(200).json({
			data: {},
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

router.delete('/', verifyToken, checkEmailValidation, async (req, res) => {
	try {
		const {
			query: { accountBookId, id },
		} = await zParser(zodSchema.manageCategory.deleteCategory, req);

		const count = await deleteCategory({
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
			accountBookId: parseInt(accountBookId, 10),
			id: parseInt(id, 10),
		});

		return res.status(200).json({
			data: { cnt: count },
			message: '',
			status: 'success',
		} satisfies TDelete);
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
