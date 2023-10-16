import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

import {
	createAccessToken,
	createRefreshToken,
	verifyAll,
	decodeToken,
	isExpiredToken,
} from '@/util/jwt';

import { setCache, deleteCache, getCache } from '@/util/cache';
import { isAdminUser, canUserWrite } from '@/util/validation/user';

export type TErrorUtil = {
	convertErrorToCustomError: typeof convertErrorToCustomError;
	CustomError: typeof CustomError;
};

export type TCacheUtil = {
	setCache: typeof setCache;
	deleteCache: typeof deleteCache;
	getCache: typeof getCache;
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
