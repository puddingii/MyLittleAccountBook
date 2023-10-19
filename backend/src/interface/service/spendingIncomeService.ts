/** Repository */
import {
	createNewColumn as createNewNFColumn,
	deleteColumn as deleteNFColumn,
	findGAB as findNotFixedGAB,
	updateColumn as updateNFColumn,
} from '@/repository/groupAccountBookRepository/dependency';
import {
	createNewColumn as createNewFColumn,
	deleteColumn as deleteFColumn,
	findGAB as findFixedGAB,
	updateColumn as updateFColumn,
} from '@/repository/cronGroupAccountBookRepository/dependency';
import { findGroup } from '@/repository/groupRepository/dependency';

/** Service */
import {
	getCategory,
	getFixedColumnList,
	getNotFixedColumnList,
} from '@/service/common/accountBook/dependency';
import { checkAdminGroupUser } from '@/service/common/user/dependency';

/** Util */
import { TErrorUtil } from '../util';

/** ETC */
import { TCycleType } from '@/interface/user';

export type TCreateNewFixedColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findGroup: typeof findGroup;
			createNewFColumn: typeof createNewFColumn;
		};
	};
	param: {
		userEmail: string;
		accountBookId: number;
		value: number;
		type: 'income' | 'spending';
		categoryId: number;
		cycleTime: number;
		cycleType: TCycleType;
		content?: string | undefined;
		needToUpdateDate: string;
	};
};

export type TCreateNewNotFixedColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findGroup: typeof findGroup;
			createNewNFColumn: typeof createNewNFColumn;
		};
	};
	param: {
		userEmail: string;
		accountBookId: number;
		value: number;
		type: 'income' | 'spending';
		categoryId: number;
		content?: string | undefined;
		spendingAndIncomeDate: string;
	};
};

export type TUpdateFixedColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		service: { checkAdminGroupUser: typeof checkAdminGroupUser };
		repository: {
			findFixedGAB: typeof findFixedGAB;
			updateFColumn: typeof updateFColumn;
		};
	};
	param: {
		userEmail: string;
		id: number;
		value?: number;
		type?: 'income' | 'spending';
		categoryId?: number;
		cycleTime?: number;
		cycleType?: TCycleType;
		content?: string | undefined;
		needToUpdateDate?: string;
	};
};

export type TUpdateNotFixedColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		service: { checkAdminGroupUser: typeof checkAdminGroupUser };
		repository: {
			findNotFixedGAB: typeof findNotFixedGAB;
			updateNFColumn: typeof updateNFColumn;
		};
	};
	param: {
		userEmail: string;
		id: number;
		value?: number;
		type?: 'income' | 'spending';
		categoryId?: number;
		content?: string | undefined;
		spendingAndIncomeDate?: string;
	};
};

export type TDeleteFixedColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		service: { checkAdminGroupUser: typeof checkAdminGroupUser };
		repository: {
			findFixedGAB: typeof findFixedGAB;
			deleteFColumn: typeof deleteFColumn;
		};
	};
	param: { id: number; userEmail: string };
};

export type TDeleteNotFixedColumn = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		service: { checkAdminGroupUser: typeof checkAdminGroupUser };
		repository: {
			findNotFixedGAB: typeof findNotFixedGAB;
			deleteNFColumn: typeof deleteNFColumn;
		};
	};
	param: { id: number; userEmail: string };
};

export type TGetDefaultInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		service: {
			getCategory: typeof getCategory;
			getFixedColumnList: typeof getFixedColumnList;
			getNotFixedColumnList: typeof getNotFixedColumnList;
		};
	};
	param: {
		accountBookId: number;
		startDate: string;
		endDate: string;
	};
};
