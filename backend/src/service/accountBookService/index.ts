import dayjs from 'dayjs';

import { getCategoryList } from '@/repository/categoryRepository';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository';
import { findAllFixedColumn } from '@/repository/cronGroupAccountBookRepository';
import { convertErrorToCustomError } from '@/util/error';

import { TGet } from '@/interface/api/response/accountBookResponse';

const getCategory = async (accountBookId: number, depth = { start: 2, end: 2 }) => {
	try {
		const categoryList = await getCategoryList(accountBookId, depth);

		const filteredList = categoryList.map(category => {
			const parentName = category.categoryNamePath.split(' > ')[0];
			return {
				parentId: category.parentId,
				childId: category.id,
				parentName,
				categoryNamePath: category.categoryNamePath,
				categoryIdPath: category.categoryIdPath,
			};
		});

		return filteredList;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Service',
			code: 400,
		});
		throw customError;
	}
};

const getNotFixedColumnList = async (
	info: {
		accountBookId: number;
		startDate: string;
		endDate: string;
	},
	categoryList: Awaited<ReturnType<typeof getCategory>>,
) => {
	try {
		const { accountBookId, endDate, startDate } = info;

		const list = await findAllNotFixedColumn({
			accountBookId,
			endDate: dayjs(endDate).toDate(),
			startDate: dayjs(startDate).toDate(),
		});

		const historyList = list.reduce(
			(acc, column) => {
				const nickname = column.users?.nickname ?? '';
				const gabInfo = (column.groupaccountbooks ?? []).map((gab, idx) => {
					return {
						id: idx,
						gabId: gab.id,
						nickname,
						category:
							categoryList.find(category => category.childId === gab.categoryId)
								?.categoryNamePath ?? '',
						type: gab.type,
						spendingAndIncomeDate: gab.spendingAndIncomeDate,
						value: gab.value,
						content: gab.content,
					};
				});
				acc.push(...gabInfo);
				return acc;
			},
			[] as TGet['data']['history']['notFixedList'],
		);

		return historyList;
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

const getFixedColumnList = async (
	info: {
		accountBookId: number;
		startDate?: string;
		endDate?: string;
	},
	categoryList: Awaited<ReturnType<typeof getCategory>>,
) => {
	try {
		const { accountBookId, endDate, startDate } = info;
		const dateInfo =
			startDate && endDate
				? {
						endDate: dayjs(endDate).toDate(),
						startDate: dayjs(startDate).toDate(),
				  }
				: {};

		const list = await findAllFixedColumn({
			accountBookId,
			...dateInfo,
		});

		const historyList = list.reduce(
			(acc, column) => {
				const nickname = column.users?.nickname ?? '';
				const gabInfo = (column.crongroupaccountbooks ?? []).map((gab, idx) => {
					return {
						id: idx,
						gabId: gab.id,
						nickname,
						category:
							categoryList.find(category => category.childId === gab.categoryId)
								?.categoryNamePath ?? '',
						type: gab.type,
						cycleType: gab.cycleType,
						cycleTime: gab.cycleTime,
						needToUpdateDate: gab.needToUpdateDate,
						value: gab.value,
						content: gab.content,
					};
				});
				acc.push(...gabInfo);
				return acc;
			},
			[] as TGet['data']['history']['fixedList'],
		);

		return historyList;
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

/** History 및 Category 반환 */
export const getSIMDefaultInfo = async (info: {
	accountBookId: number;
	startDate: string;
	endDate: string;
}) => {
	try {
		const { accountBookId } = info;
		const categoryList = await getCategory(accountBookId, { start: 2, end: 2 });

		const notFixedList = await getNotFixedColumnList(info, categoryList);
		const fixedList = await getFixedColumnList({ accountBookId }, categoryList);

		return { history: { notFixedList, fixedList }, categoryList } as TGet['data'];
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
