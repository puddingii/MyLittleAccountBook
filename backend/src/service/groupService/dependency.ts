import * as Logic from '.';

/** Repository */
import {
	createGroup,
	deleteGroup,
	findGroup,
	findGroupAccountBookList,
	findGroupUserList,
	updateGroup,
} from '@/repository/groupRepository/dependency';
import { findUserInfoWithPrivacy } from '@/repository/userRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';
import { isAdminUser } from '@/util/validation/user';

export const validateGroupUser = Logic.validateGroupUser({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroup },
});

export const getGroupAccountBookList = Logic.getGroupAccountBookList({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroupAccountBookList },
});

export const getGroupUserList = Logic.getGroupUserList({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroupUserList },
});

export const addGroup = Logic.addGroup({
	errorUtil: { convertErrorToCustomError, CustomError },
	validationUtil: { isAdminUser },
	repository: { createGroup, findGroup, findUserInfoWithPrivacy },
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
