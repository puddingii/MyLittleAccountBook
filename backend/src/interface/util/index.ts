import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

import { createAccessToken, createRefreshToken, verifyAll } from '@/util/jwt';

import { setCache, deleteCache, getCache } from '@/util/cache';

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
	verifyAll: typeof verifyAll;
};
