import dayjs from 'dayjs';
import { curry, flat, map, memoize, pipe, toArray } from '@fxts/core';

/** Interface */
import {
	TCategory,
	TGetCategory,
	TGetFixedColumnList,
	TGetNotFixedColumnList,
} from '@/interface/service/commonAccountBookService';

const findByType = curry(
	<T>(list: Array<Record<string, T>>, type: string, value: unknown) => {
		return list.find(info => info[type] === value);
	},
);

const getMemoizedFindCategoryFunction = (categoryList: TCategory[]) =>
	pipe(findByType(categoryList, 'childId'), memoize);

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
				const parent = category.categoryNamePath.split(' > ');
				const parentName = parent.at(-2) ?? parent[0];
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

			const memoizedFindCategory = getMemoizedFindCategoryFunction(categoryList);

			const historyList = pipe(
				list,
				map(column => {
					const nickname = column.users?.nickname ?? '';
					return (column.groupaccountbooks ?? []).map((gab, idx) => {
						const category = memoizedFindCategory(gab.categoryId) as
							| TCategory
							| undefined;

						return {
							id: idx,
							gabId: gab.id,
							nickname,
							category: category?.categoryNamePath ?? '',
							type: gab.type,
							spendingAndIncomeDate: gab.spendingAndIncomeDate,
							value: gab.value,
							content: gab.content,
						};
					});
				}),
				flat,
				toArray,
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
			repository: { findAllFixedColumnBasedGroup },
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

			const list = await findAllFixedColumnBasedGroup({
				accountBookId,
				...dateInfo,
			});

			const memoizedFindCategory = getMemoizedFindCategoryFunction(categoryList);

			const historyList = pipe(
				list,
				map(column => {
					const nickname = column.users?.nickname ?? '';
					return (column.crongroupaccountbooks ?? []).map((gab, idx) => {
						const category = memoizedFindCategory(gab.categoryId) as
							| TCategory
							| undefined;

						return {
							id: idx,
							gabId: gab.id,
							nickname,
							category: category?.categoryNamePath ?? '',
							type: gab.type,
							cycleType: gab.cycleType,
							cycleTime: gab.cycleTime,
							needToUpdateDate: gab.needToUpdateDate,
							value: gab.value,
							content: gab.content,
						};
					});
				}),
				flat,
				toArray,
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
