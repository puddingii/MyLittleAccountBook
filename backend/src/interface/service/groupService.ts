/** Repository */
import {
	createGroup,
	deleteGroup,
	findGroup,
	findGroupAccountBookList,
	findGroupUserList,
	updateGroup,
} from '@/repository/groupRepository/dependency';
import { findUserInfo } from '@/repository/userRepository/dependency';

/** ETC */
import { TErrorUtil, TValidationUtil } from '../util';
import GroupModel from '@/model/group';

export type TValidateGroupUser = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findGroup: typeof findGroup;
		};
	};
	param: { accountBookId: number; myEmail: string };
};

export type TGetGroupAccountBookList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findGroupAccountBookList: typeof findGroupAccountBookList;
		};
	};
	param: { userEmail: string };
};

export type TGetGroupUserList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findGroupUserList: typeof findGroupUserList;
		};
	};
	param: { accountBookId: number };
};

export type TAddGroup = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		validationUtil: Pick<TValidationUtil, 'isAdminUser'>;
		repository: {
			findGroup: typeof findGroup;
			createGroup: typeof createGroup;
			findUserInfo: typeof findUserInfo;
		};
	};
	param: {
		myEmail: string;
		userEmail: string;
		userType: GroupModel['userType'];
		accessHistory?: Date;
		accountBookId: number;
	};
};

export type TUpdateGroupInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		validationUtil: Pick<TValidationUtil, 'isAdminUser'>;
		repository: {
			findGroup: typeof findGroup;
			updateGroup: typeof updateGroup;
		};
	};
	param: {
		myEmail: string;
		userEmail: string;
		userType?: GroupModel['userType'];
		accessHistory?: Date;
		accountBookId: number;
	};
};

export type TDeleteGroupUser = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		validationUtil: Pick<TValidationUtil, 'isAdminUser'>;
		repository: {
			findGroup: typeof findGroup;
			deleteGroup: typeof deleteGroup;
		};
	};
	param: { myEmail: string; accountBookId: number; id: number };
};
