import * as Logic from '.';

/** Service */
import {
	getCategory,
	getFixedColumnList,
	getNotFixedColumnList,
} from '../common/accountBook/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const getDefaultInfo = Logic.getDefaultInfo({
	errorUtil: { convertErrorToCustomError },
	service: { getCategory, getFixedColumnList, getNotFixedColumnList },
});
