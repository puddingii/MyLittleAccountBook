/** Repository */
import {
	createCategory,
	deleteChildCategoryList,
	findCategory,
	findCategoryList,
	updateCategory,
} from '@/repository/categoryRepository/dependency';
import { findGAB as findFGAB } from '@/repository/cronGroupAccountBookRepository/dependency';
import { findGAB } from '@/repository/groupAccountBookRepository/dependency';

/** ETC */
import { TErrorUtil } from '../util';
import sequelize from '@/loader/mysql';

export type TGetCategoryList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findCategoryList: typeof findCategoryList;
		};
	};
	param: { accountBookId: number };
};

export type TAddCategory = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		sequelize: typeof sequelize;
		repository: {
			findCategory: typeof findCategory;
			createCategory: typeof createCategory;
		};
	};
	param: {
		myEmail: string;
		accountBookId: number;
		name: string;
		parentId?: number;
	};
};

export type TUpdateCategoryInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			updateCategory: typeof updateCategory;
		};
	};
	param: {
		myEmail: string;
		accountBookId: number;
		id: number;
		name: string;
	};
};

export type TDeleteCategory = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		sequelize: typeof sequelize;
		repository: {
			findCategory: typeof findCategory;
			findFGAB: typeof findFGAB;
			findGAB: typeof findGAB;
			findCategoryList: typeof findCategoryList;
			deleteChildCategoryList: typeof deleteChildCategoryList;
		};
	};
	param: {
		accountBookId: number;
		id: number;
		myEmail: string;
	};
};
