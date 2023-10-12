import dayjs from 'dayjs';

/** Interface */
import { TGet } from '@/interface/api/response/accountBookResponse';
import {
	TGetCategory,
	TGetFixedColumnList,
	TGetNotFixedColumnList,
} from '@/interface/service/commonAccountBookService';

export const getCategory =
	(dependencies: TGetCategory['dependency']) =>
	async (
		accountBookId: TGetCategory['param'][0],
		depth: TGetCategory['param'][1] = { start: 2, end: 2 },
	) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findRecursiveCategoryList },
		} = dependencies;

		try {
			const categoryList = await findRecursiveCategoryList(accountBookId, depth);

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

export const getNotFixedColumnList =
	(dependencies: TGetNotFixedColumnList['dependency']) =>
	async (
		info: TGetNotFixedColumnList['param'][0],
		categoryList: TGetNotFixedColumnList['param'][1],
	) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findAllNotFixedColumn },
		} = dependencies;

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
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const getFixedColumnList =
	(dependencies: TGetFixedColumnList['dependency']) =>
	async (
		info: TGetFixedColumnList['param'][0],
		categoryList: TGetFixedColumnList['param'][1],
	) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findAllFixedColumn },
		} = dependencies;

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
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
