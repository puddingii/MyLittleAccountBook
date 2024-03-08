import { Transaction } from 'sequelize';

/** Model */
import AccountBookModel from '@/model/accountBook';
import GroupModel from '@/model/group';
import UserModel from '@/model/user';
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupAccountBookModel from '@/model/groupAccountBook';
import AccountBookMediaModel from '@/model/accountBookMedia';

/** Util */
import { TErrorUtil } from '../util';
import { RequiredPartial } from '..';

export type TFindGroup = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupModel: typeof GroupModel;
	};
	param: Partial<{
		userEmail: string;
		accountBookId: number;
		id: number;
		userType: string;
		accessHistory: Date;
	}>;
};

export type TFindGroupWithAccountBookMedia = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupModel: typeof GroupModel;
		AccountBookMediaModel: typeof AccountBookMediaModel;
	};
	param: RequiredPartial<
		{
			userEmail: string;
			accountBookId: number;
			id: number;
			userType: string;
			accessHistory: Date;
		},
		'accountBookId'
	>;
};

export type TFindGroupAccountBookList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookModel: typeof AccountBookModel;
		GroupModel: typeof GroupModel;
	};
	param: { userEmail: string };
};

export type TFindGroupUserList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupModel: typeof GroupModel;
		UserModel: typeof UserModel;
	};
	param: { accountBookId: number };
};

export type TCreateGroupList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupModel: typeof GroupModel;
	};
	param: [
		groupInfoList: Array<{
			userEmail: string;
			userType: GroupModel['userType'];
			accessHistory?: Date;
			accountBookId: number;
		}>,
		transaction: Transaction,
	];
};

export type TCreateGroup = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupModel: typeof GroupModel;
	};
	param: [
		groupInfo: {
			userEmail: string;
			userType: GroupModel['userType'];
			accessHistory?: Date;
			accountBookId: number;
		},
		transaction: Transaction,
	];
};

export type TUpdateGroup = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupModel: typeof GroupModel;
	};
	param: [
		groupInfo: {
			userEmail: string;
			userType?: GroupModel['userType'];
			accessHistory?: Date;
			accountBookId: number;
		},
		transaction: Transaction,
	];
};

export type TDeleteGroup = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupModel: typeof GroupModel;
	};
	param: [info: { id: number; accountBookId: number }, transaction: Transaction];
};

export type TFindAllColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupModel: typeof GroupModel;
		CronGroupAccountBookModel: typeof CronGroupAccountBookModel;
		GroupAccountBookModel: typeof GroupAccountBookModel;
		UserModel: typeof UserModel;
	};
	param: {
		accountBookId: number;
		startDate?: Date;
		endDate?: Date;
	};
};
