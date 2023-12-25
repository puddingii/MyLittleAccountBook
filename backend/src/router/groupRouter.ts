import express, { Request } from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import { toDate } from '@/util/date';

/** Middleware & Service */
import { verifyToken } from '@/middleware/authentication';
import {
	addGroup,
	deleteGroupUser,
	getGroupAccountBookList,
	getGroupUserList,
	updateGroupInfo,
	validateGroupUser,
} from '@/service/groupService/dependency';

/** Interface */
import {
	TDelete,
	TGetAccountBookList,
	TGetList,
	TGetValidate,
	TPatch,
	TPost,
} from '@/interface/api/response/groupResponse';

const router = express.Router();

router.get('/accountbooklist', verifyToken, async (req, res) => {
	try {
		const userEmail = (req.user as Exclude<Request['user'], undefined>).email;
		const groupList = await getGroupAccountBookList({ userEmail });

		return res.status(200).json({
			data: groupList,
			message: '',
			status: 'success',
		} satisfies TGetAccountBookList);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.get('/userlist', verifyToken, async (req, res) => {
	try {
		const {
			query: { accountBookId },
		} = await zParser(zodSchema.group.getList, req);

		const groupList = await getGroupUserList({
			accountBookId: parseInt(accountBookId, 10),
		});

		return res.status(200).json({
			data: groupList,
			message: '',
			status: 'success',
		} satisfies TGetList);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.get('/validate', verifyToken, async (req, res) => {
	try {
		const {
			query: { accountBookId },
		} = await zParser(zodSchema.group.validation, req);

		const info = await validateGroupUser({
			accountBookId: parseInt(accountBookId, 10),
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
		});

		return res.status(200).json({
			data: info,
			message: '',
			status: 'success',
		} satisfies TGetValidate);
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
			? { ...groupInfo, accessHistory: toDate(accessHistory) }
			: { ...groupInfo };
		const newGroup = await addGroup({
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
			...paramInfo,
		});

		return res.status(200).json({
			data: newGroup,
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

router.patch('/', verifyToken, async (req, res) => {
	try {
		const {
			body: { accessHistory, ...groupInfo },
		} = await zParser(zodSchema.group.updateGroupUser, req);

		const paramInfo = accessHistory
			? { ...groupInfo, accessHistory: toDate(accessHistory) }
			: { ...groupInfo };
		await updateGroupInfo({
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
			...paramInfo,
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
