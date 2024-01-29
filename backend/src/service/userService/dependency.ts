import * as Logic from '.';

/** Repository */
import {
	findUserInfoWithPrivacyAndOAuth,
	updateUserInfo,
} from '@/repository/userRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';
import { createAccessToken, createRefreshToken, verifyAll } from '@/util/jwt';
import { setRefreshTokenCache } from '@/util/cache/v2';

export const getUserInfo = Logic.getUserInfo({
	errorUtil: { convertErrorToCustomError, CustomError },
	repository: { findUserInfoWithPrivacyAndOAuth },
});

export const updateUserInfoAndRefreshToken = Logic.updateUserInfoAndRefreshToken({
	errorUtil: { convertErrorToCustomError, CustomError },
	cacheUtil: { setCache: setRefreshTokenCache },
	jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
	repository: { updateUserInfo },
});
