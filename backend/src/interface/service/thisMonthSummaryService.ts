/** Service */
import {
	getCategory,
	getAllTypeColumnList,
} from '@/service/common/accountBook/dependency';

/** ETC */
import { TErrorUtil } from '../util';

export type TGetDefaultInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		service: {
			getCategory: typeof getCategory;
			getAllTypeColumnList: typeof getAllTypeColumnList;
		};
	};
	param: { accountBookId: number };
};
