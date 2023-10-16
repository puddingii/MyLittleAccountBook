import * as Logic from '.';

/** Model */
import GroupModel from '@/model/group';
import UserModel from '@/model/user';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const findGroup = Logic.findGroup({
	errorUtil: { convertErrorToCustomError },
	GroupModel,
});

export const findGroupList = Logic.findGroupList({
	errorUtil: { convertErrorToCustomError },
	GroupModel,
	UserModel,
});

export const createGroupList = Logic.createGroupList({
	errorUtil: { convertErrorToCustomError },
	GroupModel,
});

export const createGroup = Logic.createGroup({
	errorUtil: { convertErrorToCustomError },
	GroupModel,
});

export const updateGroup = Logic.updateGroup({
	errorUtil: { convertErrorToCustomError },
	GroupModel,
});

export const deleteGroup = Logic.deleteGroup({
	errorUtil: { convertErrorToCustomError },
	GroupModel,
});