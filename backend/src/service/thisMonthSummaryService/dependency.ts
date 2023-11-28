import * as Logic from '.';

/** Service */
import { getCategory, getAllTypeColumnList } from '../common/accountBook/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import {
	getCurrentDate,
	getEndDayOfMonth,
	getFirstDayOfMonth,
	toDate,
	toString,
} from '@/util/date';

export const getDefaultInfo = Logic.getDefaultInfo({
	errorUtil: { convertErrorToCustomError },
	dateUtil: { getCurrentDate, getEndDayOfMonth, getFirstDayOfMonth, toDate, toString },
	service: { getCategory, getAllTypeColumnList },
});
