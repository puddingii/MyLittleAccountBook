import * as Logic from '.';

/** Model */
import sequelize from '@/loader/mysql';
import CategoryModel from '@/model/category';

/** ETC */
import { convertErrorToCustomError } from '@/util/error';
import defaultCategory from '@/json/defaultCategory.json';

export const findRecursiveCategoryList = Logic.findRecursiveCategoryList({
	errorUtil: { convertErrorToCustomError },
	sequelize,
});

export const findCategoryList = Logic.findCategoryList({
	errorUtil: { convertErrorToCustomError },
	CategoryModel,
});

export const findCategory = Logic.findCategory({
	errorUtil: { convertErrorToCustomError },
	CategoryModel,
});

export const createCategory = Logic.createCategory({
	errorUtil: { convertErrorToCustomError },
	CategoryModel,
});

export const createDefaultCategory = Logic.createDefaultCategory({
	errorUtil: { convertErrorToCustomError },
	defaultCategory,
	CategoryModel,
});

export const updateCategory = Logic.updateCategory({
	errorUtil: { convertErrorToCustomError },
	CategoryModel,
});

export const deleteChildCategoryList = Logic.deleteChildCategoryList({
	errorUtil: { convertErrorToCustomError },
	CategoryModel,
});
