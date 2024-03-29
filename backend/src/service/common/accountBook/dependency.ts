import * as Logic from '.';

/** Repository */
import { findRecursiveCategoryList } from '@/repository/categoryRepository/dependency';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository/dependency';
import { findAllFixedColumnBasedGroup } from '@/repository/cronGroupAccountBookRepository/dependency';
import { findAllColumn } from '@/repository/groupRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { getRecursiveCategoryCache, setRecursiveCategoryCache } from '@/util/cache/v2';
import { toDate } from '@/util/date';

export const getCategory = Logic.getCategory({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { getCache: getRecursiveCategoryCache, setCache: setRecursiveCategoryCache },
	repository: { findRecursiveCategoryList },
});

export const getNotFixedColumnList = Logic.getNotFixedColumnList({
	errorUtil: { convertErrorToCustomError },
	dateUtil: { toDate },
	repository: { findAllNotFixedColumn },
});

export const getFixedColumnList = Logic.getFixedColumnList({
	errorUtil: { convertErrorToCustomError },
	dateUtil: { toDate },
	repository: { findAllFixedColumnBasedGroup },
});

export const getAllTypeColumnList = Logic.getAllTypeColumnList({
	errorUtil: { convertErrorToCustomError },
	dateUtil: { toDate },
	repository: { findAllColumn },
});
