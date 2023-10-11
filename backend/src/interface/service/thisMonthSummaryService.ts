/** ETC */
import { TErrorUtil } from '../util';

export type TGetDefaultInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
	};
	param: { accountBookId: number };
};
