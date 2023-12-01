/** Model */
import GroupAccountBookModel from '@/model/groupAccountBook';
import GroupModel from '@/model/group';
import UserModel from '@/model/user';

/** Util */
import { TErrorUtil } from '../util';
import { TColumnInfo } from '../model/groupAccountBookRepository';

export type TFindGAB = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupAccountBookModel: typeof GroupAccountBookModel;
		GroupModel: typeof GroupModel;
	};
	param: [gabInfo: Partial<TColumnInfo>, options?: { isIncludeGroup: boolean }];
};

export type TFindAllNotFixedColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupAccountBookModel: typeof GroupAccountBookModel;
		GroupModel: typeof GroupModel;
		UserModel: typeof UserModel;
	};
	param: {
		accountBookId: number;
		startDate: Date;
		endDate: Date;
	};
};

export type TCreateNewColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupAccountBookModel: typeof GroupAccountBookModel;
	};
	param: Omit<TColumnInfo, 'id'>;
};

export type TUpdateColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
	};
	param: [
		column: GroupAccountBookModel,
		columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
	];
};

export type TDeleteColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
	};
	param: GroupAccountBookModel;
};
