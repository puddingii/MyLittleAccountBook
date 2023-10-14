/** Model */
import GroupAccountBookModel from '@/model/groupAccountBook';
import GroupModel from '@/model/group';
import UserModel from '@/model/user';

/** Util */
import { TErrorUtil } from '../util';

export type TFindGAB = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		GroupAccountBookModel: typeof GroupAccountBookModel;
		GroupModel: typeof GroupModel;
	};
	param: [
		gabInfo: Partial<{
			id: number;
			categoryId: number;
			groupId: number;
			type: 'income' | 'spending';
			content: string;
			spendingAndIncomeDate: Date;
			value: number;
		}>,
		options?: { isIncludeGroup: boolean },
	];
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
	param: {
		categoryId: number;
		spendingAndIncomeDate: Date;
		value: number;
		content?: string;
		groupId: number;
		type: 'income' | 'spending';
	};
};

export type TUpdateColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
	};
	param: [
		column: GroupAccountBookModel,
		columnInfo: {
			categoryId?: number;
			spendingAndIncomeDate?: Date;
			value?: number;
			content?: string;
			type?: 'income' | 'spending';
		},
	];
};

export type TDeleteColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
	};
	param: GroupAccountBookModel;
};
