import * as Logic from '.';

/** Repository */
import {
	createCategory,
	findCategory,
	findCategoryList,
	updateCategory,
	deleteCategory as deleteCategoryRepo,
} from '@/repository/categoryRepository/dependency';
import { findGAB as findFGAB } from '@/repository/cronGroupAccountBookRepository/dependency';
import { findGAB } from '@/repository/groupAccountBookRepository/dependency';

/** Service */
import { checkAdminGroupUser } from '../common/user/dependency';

/** Util */
import sequelize from '@/loader/mysql';
import { convertErrorToCustomError } from '@/util/error';
import { deleteRecursiveCategoryCache } from '@/util/cache/v2';

export const getCategoryList = Logic.getCategoryList({
	errorUtil: { convertErrorToCustomError },
	repository: { findCategoryList },
});

export const addCategory = Logic.addCategory({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { deleteCache: deleteRecursiveCategoryCache },
	sequelize,
	service: { checkAdminGroupUser },
	repository: { createCategory, findCategory },
});

export const updateCategoryInfo = Logic.updateCategoryInfo({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { deleteCache: deleteRecursiveCategoryCache },
	service: { checkAdminGroupUser },
	repository: { updateCategory },
});

export const deleteCategory = Logic.deleteCategory({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { deleteCache: deleteRecursiveCategoryCache },
	service: { checkAdminGroupUser },
	repository: {
		findCategory,
		findCategoryList,
		findFGAB,
		findGAB,
		deleteCategory: deleteCategoryRepo,
	},
});
