import * as Logic from '.';

/** Model */
import AccountBookModel from '@/model/accountBook';

import { convertErrorToCustomError } from '@/util/error';

export const findOneAccountBook = Logic.findOneAccountBook({
	AccountBookModel,
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
