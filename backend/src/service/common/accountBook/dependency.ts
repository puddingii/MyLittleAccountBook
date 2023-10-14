import * as Logic from '.';

/** Repository */
import { findRecursiveCategoryList } from '@/repository/categoryRepository/dependency';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository/dependency';
import { findAllFixedColumn } from '@/repository/cronGroupAccountBookRepository/dependency';

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
	repository: { findAllFixedColumn },
});
