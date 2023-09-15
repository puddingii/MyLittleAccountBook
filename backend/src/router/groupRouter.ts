import express, { Request } from 'express';
import dayjs from 'dayjs';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import { verifyToken } from '@/middleware/authentication';
import {
	addGroup,
	deleteGroupUser,
	getGroupList,
	updateGroupInfo,
} from '@/service/groupService';

/** Interface */
import { TDelete, TGetList, TPatch, TPost } from '@/interface/api/response/groupResponse';

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
			body: { accessHistory, ...groupInfo },
		} = await zParser(zodSchema.group.addGroupUser, req);

		const paramInfo = accessHistory
			? { ...groupInfo, accessHistory: dayjs(accessHistory).toDate() }
			: { ...groupInfo };
		const newGroup = await addGroup({
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
			...paramInfo,
		});

		return res.status(200).json({
			data: newGroup,
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

router.patch('/', verifyToken, async (req, res) => {
	try {
		const {
			body: { accessHistory, ...groupInfo },
		} = await zParser(zodSchema.group.updateGroupUser, req);

		const paramInfo = accessHistory
			? { ...groupInfo, accessHistory: dayjs(accessHistory).toDate() }
			: { ...groupInfo };
		await updateGroupInfo({
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
			...paramInfo,
		});

		return res.status(200).json({
			data: {},
			message: '',
			status: 'success',
		} as TPatch);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.delete('/', verifyToken, async (req, res) => {
	try {
		const {
			query: { accountBookId, id },
		} = await zParser(zodSchema.group.deleteGroupUser, req);

		await deleteGroupUser({
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
			id: parseInt(id, 10),
			accountBookId: parseInt(accountBookId, 10),
		});

		return res.status(200).json({
			data: {},
			message: '',
			status: 'success',
		} as TDelete);
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
