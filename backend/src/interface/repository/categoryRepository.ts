import { Transaction } from 'sequelize';

/** Model */
import sequelize from '@/loader/mysql';
import CategoryModel from '@/model/category';

/** Util */
import { TErrorUtil } from '../util';

/** ETC */
import defaultCategory from '@/json/defaultCategory.json';

export type TFindRecursiveCategoryList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		sequelize: typeof sequelize;
	};
	param: [accountBookId: number, depth: { start: number; end: number }];
};

export type TFindCategoryList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CategoryModel: typeof CategoryModel;
	};
	param: {
		accountBookId: number;
		name?: string;
		parentId?: number;
		id?: number;
	};
};

export type TFindCategory = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CategoryModel: typeof CategoryModel;
	};
	param: [
		info: {
			accountBookId: number;
			name?: string;
			parentId?: number;
			id?: number;
		},
		options?: Partial<{ transaction: Transaction; lock: boolean; skipLocked: boolean }>,
	];
};

export type TCreateCategory = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CategoryModel: typeof CategoryModel;
	};
	param: [
		categoryInfo: {
			parentId?: number;
			name: string;
			accountBookId: number;
		},
		transaction?: Transaction,
	];
};

export type TCreateDefaultCategory = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CategoryModel: typeof CategoryModel;
		defaultCategory: typeof defaultCategory;
	};
	param: [accountBookId: number, transaction?: Transaction];
};

export type TUpdateCategory = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CategoryModel: typeof CategoryModel;
	};
	param: [
		info: { accountBookId: number; id: number; name: string },
		transaction?: Transaction,
	];
};

export type TDeleteChildCategoryList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CategoryModel: typeof CategoryModel;
	};
	param: [info: { parentId: number; accountBookId: number }, transaction: Transaction];
};
