import express from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import {
	createNewNotice,
	deleteNotice,
	getNotice,
	getNoticeList,
	updateNotice,
} from '@/service/headerService/dependency';
import { checkSuperUser, verifyToken } from '@/middleware/authentication';

/** Interface */
import {
	TDelete,
	TGet,
	TGetList,
	TPatch,
	TPost,
} from '@/interface/api/response/noticeResponse';

const router = express.Router();

/** Notice 단일 내용 정보 */
router.get('/', async (req, res) => {
	try {
		const {
			query: { id },
		} = await zParser(zodSchema.header.getNotice, req);

		const result = await getNotice({
			id: parseInt(id, 10),
		});

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

/** Pagination정보 및 Notice 리스트 가져오기 */
router.get('/list', async (req, res) => {
	try {
		const {
			query: { limit, page },
		} = await zParser(zodSchema.header.getNoticeList, req);

		const result = await getNoticeList({
			limit: parseInt(limit, 10),
			page: parseInt(page, 10),
		});

		return res.status(200).json({
			data: result,
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

/** Notice 생성 */
router.post('/', verifyToken, checkSuperUser, async (req, res) => {
	try {
		const { body: info } = await zParser(zodSchema.header.postNotice, req);

		const result = await createNewNotice(info);

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

/** Notice 업데이트 */
router.patch('/', verifyToken, checkSuperUser, async (req, res) => {
	try {
		const { body: info } = await zParser(zodSchema.header.patchNotice, req);

		const result = await updateNotice(info);

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

/** Notice 삭제 */
router.delete('/', verifyToken, checkSuperUser, async (req, res) => {
	try {
		const {
			query: { id },
		} = await zParser(zodSchema.header.deleteNotice, req);

		const result = await deleteNotice({ id: parseInt(id ?? -1, 10) });

		return res.status(200).json({
			data: result,
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
