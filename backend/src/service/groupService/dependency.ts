import * as Logic from '.';

/** Repository */
import {
	createGroup,
	deleteGroup,
	findGroup,
	findGroupList,
	updateGroup,
} from '@/repository/groupRepository/dependency';
import { findUserInfo } from '@/repository/userRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

export const validateGroupUser = Logic.validateGroupUser({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroup },
});

export const getGroupList = Logic.getGroupList({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroupList },
});

export const addGroup = Logic.addGroup({
	errorUtil: { convertErrorToCustomError },
	repository: { createGroup, findGroup, findUserInfo },
});

export const updateGroupInfo = Logic.updateGroupInfo({
	errorUtil: { convertErrorToCustomError, CustomError },
	repository: { findGroup, updateGroup },
});

export const deleteGroupUser = Logic.deleteGroupUser({
	errorUtil: { convertErrorToCustomError, CustomError },
	repository: { deleteGroup, findGroup },
});
