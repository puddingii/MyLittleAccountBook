import * as Logic from '.';

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

/** Service */
import { checkAdminGroupUser } from '../common/user/dependency';

/** Util */
import sequelize from '@/loader/mysql';
import { convertErrorToCustomError } from '@/util/error';

export const getCategoryList = Logic.getCategoryList({
	errorUtil: { convertErrorToCustomError },
	repository: { findCategoryList },
});

export const addCategory = Logic.addCategory({
	errorUtil: { convertErrorToCustomError },
	sequelize,
	service: { checkAdminGroupUser },
	repository: { createCategory, findCategory },
});

export const updateCategoryInfo = Logic.updateCategoryInfo({
	errorUtil: { convertErrorToCustomError },
	service: { checkAdminGroupUser },
	repository: { updateCategory },
});

export const deleteCategory = Logic.deleteCategory({
	errorUtil: { convertErrorToCustomError },
	sequelize,
	service: { checkAdminGroupUser },
	repository: {
		deleteChildCategoryList,
		findCategory,
		findCategoryList,
		findFGAB,
		findGAB,
	},
});
