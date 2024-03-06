import express, { Request } from 'express';

/** Util */
import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

/** Middleware & Service */
import { verifyToken } from '@/middleware/authentication';
import { createAccountBookAndInviteUser } from '@/service/headerService/dependency';
import {
	getAccountBookInfo,
	updateAccountBookInfo,
} from '@/service/manageAccountBook/dependency';

/** Interface */
import {
	TGetAccountBook,
	TPatchAccountBook,
	TPostAccountBook,
} from '@/interface/api/response/headerResponse';
import { decodeMultipartFormdata } from '@/middleware/multipartFormDecoder';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
	try {
		const { query: info } = await zParser(zodSchema.header.getAccountBook, req);

		const params: { id?: number; myEmail: string; content?: string } = {
			...info,
			id: parseInt(info.id ?? '', 10),
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
		};
		if (!info.id) {
			delete params.id;
		}
		const accountBookInfo = await getAccountBookInfo({
			...params,
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
		});

		return res.status(200).json({
			data: accountBookInfo,
			message: '',
			status: 'success',
		} satisfies TGetAccountBook);
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
		const { body: info } = await zParser(zodSchema.header.postAccountBook, req);

		const accountBookId = await createAccountBookAndInviteUser({
			...info,
			ownerEmail: (req.user as Exclude<Request['user'], undefined>).email,
		});

		return res.status(200).json({
			data: { accountBookId },
			message: '',
			status: 'success',
		} satisfies TPostAccountBook);
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
		const { body: info } = await zParser(zodSchema.header.patchAccountBook, req);

		await updateAccountBookInfo({
			...info,
			myEmail: (req.user as Exclude<Request['user'], undefined>).email,
		});

		return res.status(200).json({
			data: {},
			message: '',
			status: 'success',
		} satisfies TPatchAccountBook);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.post('/image', verifyToken, decodeMultipartFormdata, async (req, res) => {
	try {
		const { body: info, file } = await zParser(zodSchema.accountBook.postImage, req);

		console.log(info, file);

		return res.status(200).json({
			data: {},
			message: '',
			status: 'success',
		} satisfies TPatchAccountBook);
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
