import { convertErrorToCustomError, filterPromiseSettledResultList } from '@/util/error';
import { CustomError } from '@/util/error/class';

import {
	createAccessToken,
	createRefreshToken,
	verifyAll,
	decodeToken,
	isExpiredToken,
} from '@/util/jwt';

import { isAdminUser, canUserWrite } from '@/util/validation/user';

export type TErrorUtil = {
	convertErrorToCustomError: typeof convertErrorToCustomError;
	filterPromiseSettledResultList: typeof filterPromiseSettledResultList;
	CustomError: typeof CustomError;
};

export type TCacheUtil = {
	/** time 기본값은 600 */
	setCache: (
		key: string,
		value: number | string | Buffer,
		time?: number,
	) => Promise<void>;
	/** 캐시 삭제 */
	deleteCache: (key: string | Array<string>) => Promise<number>;
	/** 캐싱된 Key를 기준으로 Value 리턴 */
	getCache: (key: string) => Promise<string | null>;
};

export type TJwtUtil = {
	createAccessToken: typeof createAccessToken;
	createRefreshToken: typeof createRefreshToken;
	decodeToken: typeof decodeToken;
	isExpiredToken: typeof isExpiredToken;
	verifyAll: typeof verifyAll;
};

export type TValidationUtil = {
	isAdminUser: typeof isAdminUser;
	canUserWrite: typeof canUserWrite;
};
