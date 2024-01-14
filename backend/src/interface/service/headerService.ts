/** Repository */
import { createAccountBook } from '@/repository/accountBookRepository/dependency';
import { createDefaultCategory } from '@/repository/categoryRepository/dependency';
import { createGroupList } from '@/repository/groupRepository/dependency';
import { findNoticeList, findOneNotice } from '@/repository/noticeRepository/dependency';
import { findInviteEnableUserInfoList } from '@/repository/userRepository/dependency';

/** ETC */
import sequelize from '@/loader/mysql';
import { TErrorUtil } from '../util';
import GroupModel from '@/model/group';

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
