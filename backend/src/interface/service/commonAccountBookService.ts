/** Repository */
import { findRecursiveCategoryList } from '@/repository/categoryRepository/dependency';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository/dependency';
import { findAllFixedColumnBasedGroup } from '@/repository/cronGroupAccountBookRepository/dependency';
import { findAllColumn } from '@/repository/groupRepository/dependency';

/** Util */
import { TCacheUtil, TDateUtil, TErrorUtil } from '../util';

export type TCategory = {
	parentId: number | undefined;
	childId: number;
	parentName: string;
	categoryNamePath: string;
	categoryIdPath: string;
};

export type TGetCategory = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findRecursiveCategoryList: typeof findRecursiveCategoryList;
		};
		cacheUtil: Pick<TCacheUtil, 'getCache' | 'setCache'>;
	};
	param: [accountBookId: number, depth: { start: number; end: number }];
	returnType: Promise<TCategory[]>;
};

export type TGetNotFixedColumnList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		dateUtil: Pick<TDateUtil, 'toDate'>;
		repository: {
			findAllNotFixedColumn: typeof findAllNotFixedColumn;
		};
	};
	param: [
		info: {
			accountBookId: number;
			startDate: string;
			endDate: string;
		},
		categoryList: Awaited<TGetCategory['returnType']>,
	];
};

export type TGetFixedColumnList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		dateUtil: Pick<TDateUtil, 'toDate'>;
		repository: {
			findAllFixedColumnBasedGroup: typeof findAllFixedColumnBasedGroup;
		};
	};
	param: [
		info: {
			accountBookId: number;
			startDate?: string;
			endDate?: string;
		},
		categoryList: Awaited<TGetCategory['returnType']>,
	];
};

export type TGetColumnList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		dateUtil: Pick<TDateUtil, 'toDate'>;
		repository: {
			findAllColumn: typeof findAllColumn;
		};
	};
	param: [
		info: {
			accountBookId: number;
			startDate?: string;
			endDate?: string;
		},
		categoryList: Awaited<TGetCategory['returnType']>,
	];
};
