/** Service */
import {
	getCategory,
	getFixedColumnList,
	getNotFixedColumnList,
} from '@/service/common/accountBook/dependency';

/** ETC */
import { TErrorUtil } from '../util';

export type TGetDefaultInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		service: {
			getCategory: typeof getCategory;
			getFixedColumnList: typeof getFixedColumnList;
			getNotFixedColumnList: typeof getNotFixedColumnList;
		};
	};
	param: { accountBookId: number };
};
