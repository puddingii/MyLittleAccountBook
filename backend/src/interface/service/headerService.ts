import { InferAttributes } from 'sequelize';

/** Repository */
import { createAccountBook } from '@/repository/accountBookRepository/dependency';
import { createDefaultCategory } from '@/repository/categoryRepository/dependency';
import { createGroupList } from '@/repository/groupRepository/dependency';
import {
	createNotice,
	deleteNotice,
	findNoticeList,
	findOneNotice,
	updateNotice,
} from '@/repository/noticeRepository/dependency';
import { findInviteEnableUserInfoList } from '@/repository/userRepository/dependency';

/** Model */
import GroupModel from '@/model/group';
import NoticeModel from '@/model/notice';

/** ETC */
import sequelize from '@/loader/mysql';
import { TDateUtil, TErrorUtil } from '../util';
import { RequiredPartial } from '..';

export type TCreateAccountBookAndInviteUser = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		sequelize: typeof sequelize;
		repository: {
			createAccountBook: typeof createAccountBook;
			createDefaultCategory: typeof createDefaultCategory;
			createGroupList: typeof createGroupList;
			findInviteEnableUserInfoList: typeof findInviteEnableUserInfoList;
		};
	};
	param: {
		title: string;
		content?: string;
		invitedUserList: Array<{ email: string; type: GroupModel['userType'] }>;
		ownerEmail: string;
	};
};

export type TGetNotice = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findOneNotice: typeof findOneNotice;
		};
	};
	param: {
		id: number;
	};
};

export type TGetNoticeList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findNoticeList: typeof findNoticeList;
		};
	};
	param: {
		page: number;
		limit: number;
	};
};

export type TCreateNewNotice = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			createNotice: typeof createNotice;
		};
	};
	param: Pick<InferAttributes<NoticeModel>, 'content' | 'title' | 'isUpdateContent'>;
};

export type TUpdateNotice = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			updateNotice: typeof updateNotice;
		};
		dateUtil: Pick<TDateUtil, 'getCurrentDate'>;
	};
	param: RequiredPartial<InferAttributes<NoticeModel>, 'id'>;
};

export type TDeleteNotice = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			deleteNotice: typeof deleteNotice;
		};
	};
	param: { id: number };
};
