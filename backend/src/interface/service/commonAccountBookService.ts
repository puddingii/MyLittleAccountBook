/** Repository */
import { findRecursiveCategoryList } from '@/repository/categoryRepository';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository';
import { findAllFixedColumn } from '@/repository/cronGroupAccountBookRepository';

/** Util */
import { TErrorUtil } from '../util';

export type TGetCategory = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findRecursiveCategoryList: typeof findRecursiveCategoryList;
		};
	};
	param: [accountBookId: number, depth: { start: number; end: number }];
	returnType: Promise<
		{
			parentId: number | undefined;
			childId: number;
			parentName: string;
			categoryNamePath: string;
			categoryIdPath: string;
		}[]
	>;
};

export type TGetNotFixedColumnList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
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
		repository: {
			findAllFixedColumn: typeof findAllFixedColumn;
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
