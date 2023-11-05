/** Model */
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupModel from '@/model/group';
import UserModel from '@/model/user';

/** Util */
import { TErrorUtil } from '../util';

/** ETC */
import { TColumnInfo } from '@/interface/model/cronGroupAccountBookRepository';

export type TCreateNewColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CronGroupAccountBookModel: typeof CronGroupAccountBookModel;
	};
	param: Omit<TColumnInfo, 'id'>;
};

export type TFindGAB = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CronGroupAccountBookModel: typeof CronGroupAccountBookModel;
		GroupModel: typeof GroupModel;
	};
	param: [gabInfo: Partial<TColumnInfo>, options?: { isIncludeGroup: boolean }];
};

export type TFindAllFixedColumnBasedGroup = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CronGroupAccountBookModel: typeof CronGroupAccountBookModel;
		GroupModel: typeof GroupModel;
		UserModel: typeof UserModel;
	};
	param: {
		accountBookId: number;
		startDate?: Date;
		endDate?: Date;
	};
};

export type TFindAllFixedColumnBasedCron = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		CronGroupAccountBookModel: typeof CronGroupAccountBookModel;
	};
	param: {
		groupId?: number;
		id?: number;
		startDate?: Date;
		endDate?: Date;
	};
};

export type TUpdateColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
	};
	param: [
		column: CronGroupAccountBookModel,
		columnInfo: Partial<Omit<TColumnInfo, 'groupId' | 'id'>>,
	];
};

export type TDeleteColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
	};
	param: CronGroupAccountBookModel;
};
