import express from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import { verifyToken } from '@/middleware/authentication';
import { getGroupList } from '@/service/groupService';

/** Interface */
import { TGetList } from '@/interface/api/response/groupResponse';

const router = express.Router();

router.get('/list', verifyToken, async (req, res) => {
	try {
		const {
			query: { accountBookId },
		} = await zParser(zodSchema.group.getList, req);

		const groupList = await getGroupList({ accountBookId: parseInt(accountBookId, 10) });

		return res.status(200).json({
			data: groupList,
			message: '',
			status: 'success',
		} as TGetList);
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
		const {
			body: { email, type, accountBookId },
		} = await zParser(zodSchema.group.addGroupUser, req);

		return res.status(200).json({
			data: {},
			message: '',
			status: 'success',
		} as TGetList);
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
