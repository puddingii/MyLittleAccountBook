import express from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import { getNotice, getNoticeList } from '@/service/headerService/dependency';

/** Interface */
import { TGet, TGetList } from '@/interface/api/response/noticeResponse';

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

export default router;
