import { Transaction } from 'sequelize';

/** Model */
import AccountBookModel from '@/model/accountBook';

/** Util */
import { TErrorUtil } from '../util';

export type TFindOneAccountBook = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookModel: typeof AccountBookModel;
	};
	param: Partial<{ id: number; title: string }>;
};

export type TCreateAccountBook = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookModel: typeof AccountBookModel;
	};
	param: [
		info: {
			title: string;
			content?: string;
		},
		transaction: Transaction,
	];
};

export type TUpdateAccountBook = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookModel: typeof AccountBookModel;
	};
	param: [
		info: {
			title?: string;
			content?: string;
			accountBookId: number;
		},
		transaction: Transaction,
	];
};
