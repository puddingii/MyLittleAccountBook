import * as Logic from '.';

/** Model */
import GroupModel from '@/model/group';
import GroupAccountBookModel from '@/model/groupAccountBook';
import UserModel from '@/model/user';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const findGAB = Logic.findGAB({
	errorUtil: { convertErrorToCustomError },
	GroupAccountBookModel,
	GroupModel,
});

export const findAllNotFixedColumn = Logic.findAllNotFixedColumn({
	errorUtil: { convertErrorToCustomError },
	GroupAccountBookModel,
	GroupModel,
	UserModel,
});

export const createNewColumn = Logic.createNewColumn({
	errorUtil: { convertErrorToCustomError },
	GroupAccountBookModel,
});

export const updateColumn = Logic.updateColumn({
	errorUtil: { convertErrorToCustomError },
});

export const deleteColumn = Logic.deleteColumn({
	errorUtil: { convertErrorToCustomError },
	GroupAccountBookModel,
});
