/** Repository */
import {
	createGroup,
	deleteGroup,
	findGroup,
	findGroupList,
	updateGroup,
} from '@/repository/groupRepository/dependency';
import { findUserInfo } from '@/repository/userRepository/dependency';

/** ETC */
import { TErrorUtil } from '../util';
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

export type TGetGroupList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findGroupList: typeof findGroupList;
		};
	};
	param: { accountBookId: number };
};

export type TAddGroup = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
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
		repository: {
			findGroup: typeof findGroup;
			deleteGroup: typeof deleteGroup;
		};
	};
	param: { myEmail: string; accountBookId: number; id: number };
};
