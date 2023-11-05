/** Repository */
import { findRecursiveCategoryList } from '@/repository/categoryRepository/dependency';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository/dependency';
import { findAllFixedColumnBasedGroup } from '@/repository/cronGroupAccountBookRepository/dependency';

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
