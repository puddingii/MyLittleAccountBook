import { InferAttributes, Transaction } from 'sequelize';

import AccountBookMediaModel from '@/model/accountBookMedia';

import { TErrorUtil } from '../util';
import { PartialRequired, RequiredPartial } from '..';

type TAccountBookMedia = InferAttributes<AccountBookMediaModel>;

export type TFindOneAccountBookMedia = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookMediaModel: typeof AccountBookMediaModel;
	};
	param: [info: Partial<TAccountBookMedia>, transaction: Transaction];
};

export type TCreateAccountBookMedia = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookMediaModel: typeof AccountBookMediaModel;
	};
	param: [
		info: Omit<PartialRequired<TAccountBookMedia, 'updatedAt' | 'createdAt'>, 'id'>,
		transaction: Transaction,
	];
};

export type TUpdateAccountBookMedia = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookMediaModel: typeof AccountBookMediaModel;
	};
	param: [
		info: RequiredPartial<TAccountBookMedia, 'accountBookId' | 'id'>,
		transaction: Transaction,
	];
};
export type TDeleteAccountBookMedia = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookMediaModel: typeof AccountBookMediaModel;
	};
	param: [
		info: Pick<TAccountBookMedia, 'id' | 'accountBookId'>,
		transaction: Transaction,
	];
};
