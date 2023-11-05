import * as Logic from '.';

/** Model */
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupModel from '@/model/group';
import UserModel from '@/model/user';

/** ETC */
import { convertErrorToCustomError } from '@/util/error';

export const createNewColumn = Logic.createNewColumn({
	CronGroupAccountBookModel,
	errorUtil: { convertErrorToCustomError },
});

export const findGAB = Logic.findGAB({
	CronGroupAccountBookModel,
	GroupModel,
	errorUtil: { convertErrorToCustomError },
});

export const findAllFixedColumnBasedGroup = Logic.findAllFixedColumnBasedGroup({
	CronGroupAccountBookModel,
	GroupModel,
	UserModel,
	errorUtil: { convertErrorToCustomError },
});

export const findAllFixedColumnBasedCron = Logic.findAllFixedColumnBasedCron({
	CronGroupAccountBookModel,
	errorUtil: { convertErrorToCustomError },
});

export const updateColumn = Logic.updateColumn({
	errorUtil: { convertErrorToCustomError },
});

export const deleteColumn = Logic.deleteColumn({
	errorUtil: { convertErrorToCustomError },
});
