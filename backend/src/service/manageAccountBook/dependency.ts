import * as Logic from '.';

/** Repository */
import {
	findOneAccountBook,
	updateAccountBook,
} from '@/repository/accountBookRepository/dependency';
import { findGroup } from '@/repository/groupRepository/dependency';

/** Util */
import { CustomError } from '@/util/error/class';
import { convertErrorToCustomError } from '@/util/error';

export const getAccountBookInfo = Logic.getAccountBookInfo({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroup, findOneAccountBook },
});

export const updateAccountBookInfo = Logic.updateAccountBookInfo({
	errorUtil: { convertErrorToCustomError, CustomError },
	repository: { findGroup, updateAccountBook },
});
