import * as Logic from '.';

/** Repository */
import { createAccountBook } from '@/repository/accountBookRepository/dependency';
import { createDefaultCategory } from '@/repository/categoryRepository/dependency';
import { createGroupList } from '@/repository/groupRepository/dependency';
import {
	findOneNotice,
	findNoticeList,
	createNotice,
	updateNotice as updateNt,
	deleteNotice as deleteNt,
} from '@/repository/noticeRepository/dependency';
import { findInviteEnableUserInfoList } from '@/repository/userRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { getCurrentDate } from '@/util/date';

/** ETC */
import sequelize from '@/loader/mysql';

export const createAccountBookAndInviteUser = Logic.createAccountBookAndInviteUser({
	errorUtil: { convertErrorToCustomError },
	sequelize,
	repository: {
		createAccountBook,
		createDefaultCategory,
		createGroupList,
		findInviteEnableUserInfoList,
	},
});

export const getNotice = Logic.getNotice({
	errorUtil: { convertErrorToCustomError },
	repository: { findOneNotice },
});

export const getNoticeList = Logic.getNoticeList({
	errorUtil: { convertErrorToCustomError },
	repository: { findNoticeList },
});

export const createNewNotice = Logic.createNewNotice({
	errorUtil: { convertErrorToCustomError },
	repository: { createNotice },
});

export const updateNotice = Logic.updateNotice({
	errorUtil: { convertErrorToCustomError },
	repository: { updateNotice: updateNt },
	dateUtil: { getCurrentDate },
});

export const deleteNotice = Logic.deleteNotice({
	errorUtil: { convertErrorToCustomError },
	repository: { deleteNotice: deleteNt },
});
