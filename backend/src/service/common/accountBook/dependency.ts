import * as Logic from '.';

/** Repository */
import { findRecursiveCategoryList } from '@/repository/categoryRepository/dependency';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository/dependency';
import { findAllFixedColumnBasedGroup } from '@/repository/cronGroupAccountBookRepository/dependency';
import { findAllColumn } from '@/repository/groupRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const getCategory = Logic.getCategory({
	errorUtil: { convertErrorToCustomError },
	repository: { findRecursiveCategoryList },
});

export const getNotFixedColumnList = Logic.getNotFixedColumnList({
	errorUtil: { convertErrorToCustomError },
	repository: { findAllNotFixedColumn },
});

export const getFixedColumnList = Logic.getFixedColumnList({
	errorUtil: { convertErrorToCustomError },
	repository: { findAllFixedColumnBasedGroup },
});

export const getAllTypeColumnList = Logic.getAllTypeColumnList({
	errorUtil: { convertErrorToCustomError },
	repository: { findAllColumn },
});
