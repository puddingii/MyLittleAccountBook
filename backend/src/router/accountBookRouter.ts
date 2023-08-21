import express, { Request } from 'express';

import zParser from '@/util/parser';
import zodSchema from '@/util/parser/schema';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

import { verifyToken } from '@/middleware/authentication';
import { getCategory } from '@/service/accountBookService';
import { COLUMN_WRITE_TYPE } from '@/util/parser/schema/accountBookSchema';

import { TGetCategory } from '@/interface/api/response/accountBookResponse';
import {
	createNewFixedColumn,
	createNewNotFixedColumn,
} from '@/service/spendingIncomeService';

const router = express.Router();

router.get('/category', verifyToken, async (req, res) => {
	try {
		const {
			query: { accountBookId },
		} = await zParser(zodSchema.accountBook.getCategory, req);

		const list = await getCategory(parseInt(accountBookId, 10));

		return res
			.status(200)
			.json({ data: list, message: '', status: 'success' } as TGetCategory);
	} catch (error) {
		const { message, traceList, code } = convertErrorToCustomError(error, {
			trace: 'Router',
			code: 400,
		});
		logger.error(message, traceList);

		return res.status(code).json({ data: {}, message, status: 'fail' });
	}
});

router.post('/column', verifyToken, async (req, res) => {
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
			.json({ data: {}, message: '', status: 'success' } as TGetCategory);
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
