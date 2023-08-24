import dayjs from 'dayjs';

import { getCategoryList } from '@/repository/categoryRepository';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository';
import { convertErrorToCustomError } from '@/util/error';

export const getCategory = async (
	accountBookId: number,
	depth = { start: 2, end: 2 },
) => {
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

export const getNotFixedColumnList = async (info: {
	accountBookId: number;
	startDate: string;
	endDate: string;
}) => {
	try {
		const { accountBookId, endDate, startDate } = info;
		const categoryList = await getCategory(accountBookId, { start: 2, end: 2 });

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
			[] as Array<{
				id: number;
				gabId: number;
				nickname: string;
				category: string;
				type: string;
				spendingAndIncomeDate: Date;
				value: number;
				content?: string;
			}>,
		);

		return { historyList, categoryList };
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
