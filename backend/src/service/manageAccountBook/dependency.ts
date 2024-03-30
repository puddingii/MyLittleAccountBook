import * as Logic from '.';

/** Repository */
import {
	findOneAccountBookWithImage,
	updateAccountBook,
} from '@/repository/accountBookRepository/dependency';
import {
	findGroup,
	findGroupWithAccountBookMedia,
} from '@/repository/groupRepository/dependency';
import {
	createAccountBookMedia,
	updateAccountBookMedia,
} from '@/repository/accountBookMediaRepository/dependency';

/** Util */
import { CustomError } from '@/util/error/class';
import { convertErrorToCustomError } from '@/util/error';
import { isAdminUser } from '@/util/validation/user';
import { getRandomString } from '@/util/string';
import imageEvent from '@/pubsub/imagePubsub';

import { FILE_NAME_LENGTH, FilePath } from '@/enum';

export const getAccountBookInfo = Logic.getAccountBookInfo({
	errorUtil: { convertErrorToCustomError },
	repository: { findGroup, findOneAccountBookWithImage },
});

export const updateAccountBookInfo = Logic.updateAccountBookInfo({
	errorUtil: { convertErrorToCustomError, CustomError },
	validationUtil: { isAdminUser },
	repository: { findGroup, updateAccountBook },
});

export const updateAccountBookImageInfo = Logic.updateAccountBookImageInfo({
	stringUtil: { getRandomString },
	errorUtil: { convertErrorToCustomError, CustomError },
	repository: {
		createAccountBookMedia,
		findGroupWithAccountBookMedia,
		updateAccountBookMedia,
	},
	validationUtil: { isAdminUser },
	eventEmitter: imageEvent,
	fileInfo: { nameLength: FILE_NAME_LENGTH, path: FilePath.Image },
});
