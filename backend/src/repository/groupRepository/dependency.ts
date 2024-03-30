import * as Logic from '.';

/** Model */
import AccountBookModel from '@/model/accountBook';
import AccountBookMediaModel from '@/model/accountBookMedia';
import GroupModel from '@/model/group';
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupAccountBookModel from '@/model/groupAccountBook';
import UserModel from '@/model/user';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const findGroup = Logic.findGroup({
	errorUtil: { convertErrorToCustomError },
	GroupModel,
});

export const findGroupWithAccountBookMedia = Logic.findGroupWithAccountBookMedia({
	errorUtil: { convertErrorToCustomError },
	AccountBookMediaModel,
	GroupModel,
});

export const findGroupAccountBookList = Logic.findGroupAccountBookList({
	errorUtil: { convertErrorToCustomError },
	GroupModel,
	AccountBookModel,
});

export const findGroupUserList = Logic.findGroupUserList({
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

export const findAllColumn = Logic.findAllColumn({
	errorUtil: { convertErrorToCustomError },
	CronGroupAccountBookModel,
	GroupAccountBookModel,
	GroupModel,
	UserModel,
});
