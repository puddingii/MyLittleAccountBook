import * as Logic from '.';

/** Repository */
import {
	createNewColumn as createNewNFColumn,
	deleteColumn as deleteNFColumn,
	findGAB as findNotFixedGAB,
	updateColumn as updateNFColumn,
} from '@/repository/groupAccountBookRepository/dependency';
import {
	createNewColumn as createNewFColumn,
	deleteColumn as deleteFColumn,
	findGAB as findFixedGAB,
	updateColumn as updateFColumn,
} from '@/repository/cronGroupAccountBookRepository/dependency';
import { findGroup } from '@/repository/groupRepository/dependency';

/** Service */
import { checkAdminGroupUser } from '../common/user/dependency';
import {
	getCategory,
	getFixedColumnList,
	getNotFixedColumnList,
} from '../common/accountBook/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

export const createNewFixedColumn = Logic.createNewFixedColumn({
	errorUtil: { convertErrorToCustomError },
	repository: { createNewFColumn, findGroup },
});

export const createNewNotFixedColumn = Logic.createNewNotFixedColumn({
	errorUtil: { convertErrorToCustomError },
	repository: { createNewNFColumn, findGroup },
});

export const updateFixedColumn = Logic.updateFixedColumn({
	errorUtil: { convertErrorToCustomError, CustomError },
	service: { checkAdminGroupUser },
	repository: { findFixedGAB, updateFColumn },
});

export const updateNotFixedColumn = Logic.updateNotFixedColumn({
	errorUtil: { convertErrorToCustomError, CustomError },
	service: { checkAdminGroupUser },
	repository: { findNotFixedGAB, updateNFColumn },
});

export const deleteFixedColumn = Logic.deleteFixedColumn({
	errorUtil: { convertErrorToCustomError, CustomError },
	service: { checkAdminGroupUser },
	repository: { deleteFColumn, findFixedGAB },
});

export const deleteNotFixedColumn = Logic.deleteNotFixedColumn({
	errorUtil: { convertErrorToCustomError, CustomError },
	service: { checkAdminGroupUser },
	repository: { deleteNFColumn, findNotFixedGAB },
});

export const getDefaultInfo = Logic.getDefaultInfo({
	errorUtil: { convertErrorToCustomError },
	service: { getCategory, getFixedColumnList, getNotFixedColumnList },
});
