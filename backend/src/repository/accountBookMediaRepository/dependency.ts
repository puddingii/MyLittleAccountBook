import * as Logic from '.';

import AccountBookMediaModel from '@/model/accountBookMedia';

import { convertErrorToCustomError } from '@/util/error';

export const findOneAccountBookMedia = Logic.findOneAccountBookMedia({
	AccountBookMediaModel,
	errorUtil: { convertErrorToCustomError },
});

export const createAccountBookMedia = Logic.createAccountBookMedia({
	AccountBookMediaModel,
	errorUtil: { convertErrorToCustomError },
});

export const updateAccountBookMedia = Logic.updateAccountBookMedia({
	AccountBookMediaModel,
	errorUtil: { convertErrorToCustomError },
});

export const deleteAccountBookMedia = Logic.deleteAccountBookMedia({
	AccountBookMediaModel,
	errorUtil: { convertErrorToCustomError },
});
