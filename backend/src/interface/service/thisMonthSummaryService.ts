/** Service */
import {
	getCategory,
	getAllTypeColumnList,
} from '@/service/common/accountBook/dependency';

/** ETC */
import { TDateUtil, TErrorUtil } from '../util';

export type TGetDefaultInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		dateUtil: Pick<
			TDateUtil,
			'getCurrentDate' | 'getFirstDayOfMonth' | 'getEndDayOfMonth' | 'toDate' | 'toString'
		>;
		service: {
			getCategory: typeof getCategory;
			getAllTypeColumnList: typeof getAllTypeColumnList;
		};
	};
	param: { accountBookId: number };
};
