import * as Logic from '.';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const getDefaultInfo = Logic.getDefaultInfo({
	errorUtil: { convertErrorToCustomError },
});
