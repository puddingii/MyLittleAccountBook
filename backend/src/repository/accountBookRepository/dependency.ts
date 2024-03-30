import * as Logic from '.';

/** Model */
import AccountBookModel from '@/model/accountBook';
import AccountBookMediaModel from '@/model/accountBookMedia';

import { convertErrorToCustomError } from '@/util/error';

export const findOneAccountBook = Logic.findOneAccountBook({
	AccountBookModel,
	errorUtil: { convertErrorToCustomError },
});

export const findOneAccountBookWithImage = Logic.findOneAccountBookWithImage({
	AccountBookModel,
	AccountBookMediaModel,
	errorUtil: { convertErrorToCustomError },
});

export const createAccountBook = Logic.createAccountBook({
	AccountBookModel,
	errorUtil: { convertErrorToCustomError },
});

export const updateAccountBook = Logic.updateAccountBook({
	AccountBookModel,
	errorUtil: { convertErrorToCustomError },
});
