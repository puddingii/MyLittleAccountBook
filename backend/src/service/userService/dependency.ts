import * as Logic from '.';

/** Repository */
import { findUserInfo, updateUserInfo } from '@/repository/userRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';
import { createAccessToken, createRefreshToken, verifyAll } from '@/util/jwt';
import { setCache } from '@/util/cache';

export const getUserInfo = Logic.getUserInfo({
	errorUtil: { convertErrorToCustomError },
	repository: { findUserInfo },
});

export const updateUserInfoAndRefreshToken = Logic.updateUserInfoAndRefreshToken({
	errorUtil: { convertErrorToCustomError, CustomError },
	cacheUtil: { setCache },
	jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
	repository: { updateUserInfo },
});
