import express, { Request } from 'express';

import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

import { verifyToken } from '@/middleware/authentication';
import { getSIMDefaultInfo } from '@/service/accountBookService';
import { COLUMN_WRITE_TYPE } from '@/util/parser/schema/accountBookSchema';

import { TGet, TPostColumn } from '@/interface/api/response/accountBookResponse';
import {
	createNewFixedColumn,
	createNewNotFixedColumn,
	updateFixedColumn,
	updateNotFixedColumn,
} from '@/service/spendingIncomeService';

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
			.json({ data: { newId }, message: '', status: 'success' } as TPostColumn);
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
			.json({ data: {}, message: '', status: 'success' } as TPostColumn);
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
		const columnInfo = await zParser(zodSchema.accountBook.postColumn, req.body);

		if (columnInfo.writeType === COLUMN_WRITE_TYPE.FIXED) {
			const { category, ...columnData } = columnInfo;
			await createNewFixedColumn({
				categoryId: category,
				userEmail: (req.user as Exclude<Request['user'], undefined>).email,
				...columnData,
			});
		} else {
			const { category, ...columnData } = columnInfo;
			await createNewNotFixedColumn({
				categoryId: category,
				userEmail: (req.user as Exclude<Request['user'], undefined>).email,
				...columnData,
			});
		}

		return res
			.status(200)
			.json({ data: {}, message: '', status: 'success' } as TPostColumn);
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

		const result = await getSIMDefaultInfo({
			accountBookId: parseInt(accountBookId, 10),
			startDate,
			endDate,
		});

		return res.status(200).json({
			data: result,
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

export default router;
