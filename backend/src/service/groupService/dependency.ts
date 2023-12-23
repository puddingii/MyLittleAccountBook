import * as Logic from '.';

/** Repository */
import {
	createGroup,
	deleteGroup,
	findGroup,
	findGroupUserList,
	updateGroup,
} from '@/repository/groupRepository/dependency';
import { findUserInfo } from '@/repository/userRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';
import { isAdminUser } from '@/util/validation/user';

export const validateGroupUser = Logic.validateGroupUser({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroup },
});

export const getGroupUserList = Logic.getGroupUserList({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroupUserList },
});

export const addGroup = Logic.addGroup({
	errorUtil: { convertErrorToCustomError },
	validationUtil: { isAdminUser },
	repository: { createGroup, findGroup, findUserInfo },
});

export const updateGroupInfo = Logic.updateGroupInfo({
	errorUtil: { convertErrorToCustomError, CustomError },
	validationUtil: { isAdminUser },
	repository: { findGroup, updateGroup },
});

export const deleteGroupUser = Logic.deleteGroupUser({
	errorUtil: { convertErrorToCustomError, CustomError },
	validationUtil: { isAdminUser },
	repository: { deleteGroup, findGroup },
});
