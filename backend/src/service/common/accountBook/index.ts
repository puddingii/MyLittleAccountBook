import { curry, flatMap, map, memoize, pipe, toArray, zipWithIndex } from '@fxts/core';

import GroupModel from '@/model/group';

/** Interface */
import {
	TCategory,
	TGetCategory,
	TGetColumnList,
	TGetFixedColumnList,
	TGetNotFixedColumnList,
} from '@/interface/service/commonAccountBookService';

/**
 * List가 Object형식의 데이터를 담고 있다면,
 * Object의 key값에 해당하는 데이터 가져오는 기능
 */
export const findByType = curry(
	<T>(list: Array<Record<string, T>>, type: string, value: unknown) => {
		return list.find(info => info[type] === value);
	},
);

/**
 * ChildID 기준으로 카테고리 정보 가져오기.
 * 카테고리 리스트를 미리 findByType에 담고
 * 앞으로 파람값으로 올 Value가 전에 호출된 값이라면 캐싱처리된 값을 불러옴.
 */
const findCategoryByChildId = (categoryList: TCategory[]) =>
	pipe('childId', findByType(categoryList), memoize);

/**
 * 고정/변동 지출 상황에 맞게 데이터 매핑.
 * 다만, 공통적으로 들어가는 데이터의 경우 이 function에서 처리
 * gabMapper로 상황에 맞게끔 사용할 수 있게 처리.(변동/고정/추후 업데이트 등등..?)
 * 카테고리 찾는 함수의 경우 캐싱처리가 가능한 함수 사용할 것
 */
const getHistory = <T extends { categoryId?: number }, R>(
	dependencies: {
		findCategory: ReturnType<typeof findCategoryByChildId>;
		gabMapper: (obj: T) => R;
	},
	info: { nickname: string; list: T[] },
) => {
	const { findCategory, gabMapper } = dependencies;
	const { list, nickname } = info;

	return pipe(
		list,
		zipWithIndex,
		map(([idx, gab]) => {
			const categoryInfo = findCategory(gab.categoryId);
			const category = (categoryInfo?.categoryNamePath ?? '') as string;
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
};

/** GroupModel의 유저 정보(Join결과)에서 닉네임 가져오기 */
const getGroupUserNickname = (group: GroupModel) => group.users?.nickname ?? '';

/** Recursive처리된 카테고리 데이터 가져오기 */
export const getCategory =
	(dependencies: TGetCategory['dependency']) =>
	async (
		accountBookId: TGetCategory['param'][0],
		depth: TGetCategory['param'][1] = { start: 2, end: 2 },
	) => {
		const {
			errorUtil: { convertErrorToCustomError },
			cacheUtil: { getCache, setCache },
			repository: { findRecursiveCategoryList },
		} = dependencies;

		try {
			const cacheKey = `${accountBookId}`;
			const cachedJson = await getCache(cacheKey);

			/** 캐싱된 데이터가 있을땐 그거 사용. 만약 카테고리 내용이 변경된 상황이 있다면 캐싱된 데이터가 없음 */
			if (cachedJson) {
				const result: TGetCategory['returnType'] = await JSON.parse(cachedJson);

				return result;
			}

			/** DB에서 데이터 가져오고 결과물 캐싱처리 */
			const categoryList = await findRecursiveCategoryList(accountBookId, depth);

			/** 헷갈리지 않게끔 직관적인 key값으로 변경 및 데이터 추가. */
			const mappedList = pipe(
				categoryList,
				map(category => {
					const parent = category.categoryNamePath.split(' > ');
					const parentName = parent.at(-2) ?? parent[0];
					return {
						parentId: category.parentId,
						childId: category.id,
						parentName,
						categoryNamePath: category.categoryNamePath,
						categoryIdPath: category.categoryIdPath,
					};
				}),
				toArray,
			);

			await setCache(cacheKey, JSON.stringify(mappedList), 300);

			return mappedList;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/** 변동기록 매핑 */
const mappingNotFixedHistory = (
	dependencies: { findCategory: ReturnType<typeof findCategoryByChildId> },
	info: { list: GroupModel[] },
) =>
	pipe(
		info.list,
		flatMap(column =>
			getHistory(
				{
					findCategory: dependencies.findCategory,
					gabMapper: gab => ({
						gabId: gab.id,
						type: gab.type,
						spendingAndIncomeDate: gab.spendingAndIncomeDate,
						value: gab.value,
						content: gab.content,
					}),
				},
				{
					nickname: getGroupUserNickname(column),
					list: column.groupaccountbooks ?? [],
				},
			),
		),
		toArray,
	);

/** 변동지출 내용 리스트 가져오기 */
export const getNotFixedColumnList =
	(dependencies: TGetNotFixedColumnList['dependency']) =>
	async (
		info: TGetNotFixedColumnList['param'][0],
		categoryList: TGetNotFixedColumnList['param'][1],
	) => {
		const {
			errorUtil: { convertErrorToCustomError },
			dateUtil: { toDate },
			repository: { findAllNotFixedColumn },
		} = dependencies;

		try {
			const { accountBookId, endDate, startDate } = info;

			const list = await findAllNotFixedColumn({
				accountBookId,
				endDate: toDate(endDate),
				startDate: toDate(startDate),
			});

			const findCategory = findCategoryByChildId(categoryList);
			const historyList = mappingNotFixedHistory({ findCategory }, { list });

			return historyList;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/** 고정기록 매핑 */
const mappingFixedHistory = (
	dependencies: { findCategory: ReturnType<typeof findCategoryByChildId> },
	info: { list: GroupModel[] },
) =>
	pipe(
		info.list,
		flatMap(column =>
			getHistory(
				{
					findCategory: dependencies.findCategory,
					gabMapper: gab => ({
						gabId: gab.id,
						type: gab.type,
						cycleType: gab.cycleType,
						cycleTime: gab.cycleTime,
						needToUpdateDate: gab.needToUpdateDate,
						value: gab.value,
						content: gab.content,
					}),
				},
				{
					nickname: getGroupUserNickname(column),
					list: column.crongroupaccountbooks ?? [],
				},
			),
		),
		toArray,
	);

/** 고정지출 내용 리스트 가져오기 */
export const getFixedColumnList =
	(dependencies: TGetFixedColumnList['dependency']) =>
	async (
		info: TGetFixedColumnList['param'][0],
		categoryList: TGetFixedColumnList['param'][1],
	) => {
		const {
			errorUtil: { convertErrorToCustomError },
			dateUtil: { toDate },
			repository: { findAllFixedColumnBasedGroup },
		} = dependencies;

		try {
			const { accountBookId, endDate, startDate } = info;
			const dateInfo =
				startDate && endDate
					? {
							endDate: toDate(endDate),
							startDate: toDate(startDate),
					  }
					: {};

			const list = await findAllFixedColumnBasedGroup({
				accountBookId,
				...dateInfo,
			});

			const findCategory = findCategoryByChildId(categoryList);

			const historyList = mappingFixedHistory({ findCategory }, { list });

			return historyList;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/** 변동/고정 지출 내용 리스트 가져오기 */
export const getAllTypeColumnList =
	(dependencies: TGetColumnList['dependency']) =>
	async (info: TGetColumnList['param'][0], categoryList: TGetColumnList['param'][1]) => {
		const {
			errorUtil: { convertErrorToCustomError },
			dateUtil: { toDate },
			repository: { findAllColumn },
		} = dependencies;

		try {
			const { accountBookId, endDate, startDate } = info;
			const dateInfo =
				startDate && endDate
					? {
							endDate: toDate(endDate),
							startDate: toDate(startDate),
					  }
					: {};

			const list = await findAllColumn({
				accountBookId,
				...dateInfo,
			});

			const findCategory = findCategoryByChildId(categoryList);

			const fgab = mappingFixedHistory({ findCategory }, { list });
			const nfgab = mappingNotFixedHistory({ findCategory }, { list });

			return { nfgab, fgab };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
