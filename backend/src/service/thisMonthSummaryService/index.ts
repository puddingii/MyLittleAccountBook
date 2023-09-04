import dayjs from 'dayjs';

import {
	getCategory,
	getFixedColumnList,
	getNotFixedColumnList,
} from '../common/getService';
import { convertErrorToCustomError } from '@/util/error';

import { TGet } from '@/interface/api/response/accountBookResponse';

/** 이번 달의 History 및 Category 반환(해당 페이지에서 보여줄 기본값 가져오기) */
export const getDefaultInfo = async (info: { accountBookId: number }) => {
	try {
		const { accountBookId } = info;
		const findOptions = {
			...info,
			startDate: dayjs().startOf('month').toDate().toString(),
			endDate: dayjs().endOf('month').toDate().toString(),
		};
		const categoryList = await getCategory(accountBookId, { start: 2, end: 2 });

		const notFixedList = await getNotFixedColumnList(findOptions, categoryList);
		const fixedList = await getFixedColumnList(findOptions, categoryList);

		return { history: { notFixedList, fixedList }, categoryList } as TGet['data'];
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
