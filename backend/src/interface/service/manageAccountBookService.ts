/** Repository */
import {
	findOneAccountBook,
	updateAccountBook,
} from '@/repository/accountBookRepository/dependency';
import { findGroup } from '@/repository/groupRepository/dependency';

/** ETC */
import { TErrorUtil } from '../util';

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
