import { Request } from 'express';

/** Repository */
import {
	findOneAccountBook,
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

/** ETC */
import { TErrorUtil, TStringUtil, TValidationUtil } from '../util';
import { TPostImageQuery } from '@/util/parser/schema/accountBookSchema';
import type AccountBookMediaModel from '@/model/accountBookMedia';

import { TImageEventEmitter } from '@/interface/pubsub/image';

export type TGetAccountBookInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findGroup: typeof findGroup;
			findOneAccountBook: typeof findOneAccountBook;
		};
	};
	param: {
		id?: number;
		title?: string;
		myEmail: string;
	};
};

export type TUpdateAccountBookInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		validationUtil: Pick<TValidationUtil, 'isAdminUser'>;
		repository: {
			findGroup: typeof findGroup;
			updateAccountBook: typeof updateAccountBook;
		};
	};
	param: {
		myEmail: string;
		title?: string;
		content?: string;
		accountBookId: number;
	};
};

export type TUpdateAccountBookMediaInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		stringUtil: Pick<TStringUtil, 'getRandomString'>;
		validationUtil: Pick<TValidationUtil, 'isAdminUser'>;
		eventEmitter: TImageEventEmitter;
		repository: {
			findGroupWithAccountBookMedia: typeof findGroupWithAccountBookMedia;
			updateAccountBookMedia: typeof updateAccountBookMedia;
			createAccountBookMedia: typeof createAccountBookMedia;
		};
		fileInfo: {
			path: string;
			nameLength: number;
		};
	};
	param: {
		myEmail: string;
		accountBookId: number;
		file: TPostImageQuery['file'];
	};
};

export type TSaveImageInfo = {
	param: {
		file: { path: string; mimeType: string; size: number; nameLength: number };
		abm?: AccountBookMediaModel;
		accountBookId: number;
	};
	dependency: Pick<
		TUpdateAccountBookMediaInfo['dependency']['repository'],
		'createAccountBookMedia' | 'updateAccountBookMedia'
	> &
		Pick<TUpdateAccountBookMediaInfo['dependency']['stringUtil'], 'getRandomString'>;
};
