import dayjs from 'dayjs';
import {
	curry,
	flatMap,
	map,
	memoize,
	pick,
	pipe,
	toArray,
	zipWithIndex,
} from '@fxts/core';

/** Interface */
import {
	TCategory,
	TGetCategory,
	TGetColumnList,
	TGetFixedColumnList,
	TGetNotFixedColumnList,
} from '@/interface/service/commonAccountBookService';

const findByType = curry(
	<T>(list: Array<Record<string, T>>, type: string, value: unknown) => {
		return list.find(info => info[type] === value);
	},
);

const findCategoryByChildId = (categoryList: TCategory[]) =>
	pipe('childId', findByType(categoryList), memoize);

const getHistory = <T extends object, R>(
	nickname: string,
	findCategory: ReturnType<typeof findCategoryByChildId>,
	gabMapper: (obj: T) => R,
	list: T[],
) =>
	pipe(
		list,
		zipWithIndex,
		map(([idx, gab]) => {
			pipe(gab, findCategory, pick('categoryNamePath'));
			const category = (pipe(gab, findCategory)?.categoryNamePath ?? '') as string;
			const gabInfo = gabMapper(gab);
			return {
				id: idx,
				nickname,
				category,
				...gabInfo,
			};
		}),
		toArray,
	);

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

			const findCategory = findCategoryByChildId(categoryList);

			const historyList = pipe(
				list,
				flatMap(column => {
					const nickname = column.users?.nickname ?? '';
					const gabList = column.groupaccountbooks ?? [];

					return getHistory(
						nickname,
						findCategory,
						gab => ({
							gabId: gab.id,
							type: gab.type,
							spendingAndIncomeDate: gab.spendingAndIncomeDate,
							value: gab.value,
							content: gab.content,
						}),
						gabList,
					);
				}),
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

			const findCategory = findCategoryByChildId(categoryList);

			const historyList = pipe(
				list,
				flatMap(column => {
					const nickname = column.users?.nickname ?? '';
					const cgabList = column.crongroupaccountbooks ?? [];

					return getHistory(
						nickname,
						findCategory,
						gab => ({
							gabId: gab.id,
							type: gab.type,
							cycleType: gab.cycleType,
							cycleTime: gab.cycleTime,
							needToUpdateDate: gab.needToUpdateDate,
							value: gab.value,
							content: gab.content,
						}),
						cgabList,
					);
				}),
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

export const getAllTypeColumnList =
	(dependencies: TGetColumnList['dependency']) =>
	async (info: TGetColumnList['param'][0], categoryList: TGetColumnList['param'][1]) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findAllColumn },
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

			const list = await findAllColumn({
				accountBookId,
				...dateInfo,
			});

			const findCategory = findCategoryByChildId(categoryList);

			const historyList = pipe(
				list,
				flatMap(column => {
					const nickname = column.users?.nickname ?? '';
					const gabList = column.groupaccountbooks ?? [];
					const cgabList = column.crongroupaccountbooks ?? [];

					const nfgab = getHistory(
						nickname,
						findCategory,
						gab => ({
							gabId: gab.id,
							type: gab.type,
							spendingAndIncomeDate: gab.spendingAndIncomeDate,
							value: gab.value,
							content: gab.content,
						}),
						gabList,
					);
					const fgab = getHistory(
						nickname,
						findCategory,
						gab => ({
							gabId: gab.id,
							type: gab.type,
							cycleType: gab.cycleType,
							cycleTime: gab.cycleTime,
							needToUpdateDate: gab.needToUpdateDate,
							value: gab.value,
							content: gab.content,
						}),
						cgabList,
					);

					return { nfgab, fgab };
				}),
				toArray,
			);

			return historyList[0];
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
