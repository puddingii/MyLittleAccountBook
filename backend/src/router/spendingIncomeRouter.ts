import express, { Request } from 'express';

import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

import { verifyToken } from '@/middleware/authentication';
import {
	getDefaultInfo,
	createNewFixedColumn,
	createNewNotFixedColumn,
	updateFixedColumn,
	updateNotFixedColumn,
	deleteNotFixedColumn,
	deleteFixedColumn,
} from '@/service/spendingIncomeService/dependency';
import { COLUMN_WRITE_TYPE } from '@/util/parser/schema/accountBookSchema';

import {
	TDeleteColumn,
	TGet,
	TPostColumn,
	TPatchColumn,
} from '@/interface/api/response/accountBookResponse';

const router = express.Router();

router.post('/column', verifyToken, async (req, res) => {
	try {
		const columnInfo = await zParser(zodSchema.accountBook.postColumn, req.body);

		let newId;
		if (columnInfo.writeType === COLUMN_WRITE_TYPE.FIXED) {
			const { category, ...columnData } = columnInfo;
			newId = await createNewFixedColumn({
				categoryId: category,
				userEmail: (req.user as Exclude<Request['user'], undefined>).email,
				...columnData,
			});
		} else {
			const { category, ...columnData } = columnInfo;
			newId = await createNewNotFixedColumn({
				categoryId: category,
				userEmail: (req.user as Exclude<Request['user'], undefined>).email,
				...columnData,
			});
		}

		return res
			.status(200)
			.json({ data: { newId }, message: '', status: 'success' } satisfies TPostColumn);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.patch('/column', verifyToken, async (req, res) => {
	try {
		const columnInfo = await zParser(zodSchema.accountBook.patchColumn, req.body);

		if (columnInfo.writeType === COLUMN_WRITE_TYPE.FIXED) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { category, writeType, ...columnData } = columnInfo;
			await updateFixedColumn({
				id: columnInfo.gabId,
				categoryId: category,
				userEmail: (req.user as Exclude<Request['user'], undefined>).email,
				...columnData,
			});
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { category, writeType, ...columnData } = columnInfo;
			await updateNotFixedColumn({
				id: columnInfo.gabId,
				categoryId: category,
				userEmail: (req.user as Exclude<Request['user'], undefined>).email,
				...columnData,
			});
		}

		return res
			.status(200)
			.json({ data: {}, message: '', status: 'success' } satisfies TPatchColumn);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.delete('/column', verifyToken, async (req, res) => {
	try {
		const {
			query: { id, writeType },
		} = await zParser(zodSchema.accountBook.deleteColumn, req);
		const convertedId = parseInt(id, 10);

		if (writeType === COLUMN_WRITE_TYPE.FIXED) {
			await deleteFixedColumn({
				id: convertedId,
				userEmail: (req.user as Exclude<Request['user'], undefined>).email,
			});
		} else {
			await deleteNotFixedColumn({
				id: convertedId,
				userEmail: (req.user as Exclude<Request['user'], undefined>).email,
			});
		}

		return res
			.status(200)
			.json({ data: {}, message: '', status: 'success' } satisfies TDeleteColumn);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.get('/', verifyToken, async (req, res) => {
	try {
		const {
			query: { accountBookId, endDate, startDate },
		} = await zParser(zodSchema.accountBook.getColumnList, req);

		const result = await getDefaultInfo({
			accountBookId: parseInt(accountBookId, 10),
			startDate,
			endDate,
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

export default router;
