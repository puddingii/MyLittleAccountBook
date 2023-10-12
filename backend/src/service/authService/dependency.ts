import * as Logic from '.';

/** Repository */
import {
	createEmailUser,
	createSocialUser,
	findOneSocialUserInfo,
	findOneUser,
} from '@/repository/authRepository';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { deleteCache, getCache, setCache } from '@/util/cache';
import {
	createRefreshToken,
	createAccessToken,
	decodeToken,
	isExpiredToken,
} from '@/util/jwt';

export const emailJoin = Logic.emailJoin({
	errorUtil: { convertErrorToCustomError },
	repository: { createEmailUser },
});

export const emailLogin = Logic.emailLogin({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { setCache },
	jwtUtil: { createAccessToken, createRefreshToken },
	repository: { findOneUser },
});

export const getSocialLoginLocation = Logic.getSocialLoginLocation({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { setCache },
});

export const googleLogin = Logic.googleLogin({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { setCache },
	jwtUtil: { createAccessToken, createRefreshToken },
	repository: { createSocialUser, findOneSocialUserInfo },
});

export const naverLogin = Logic.naverLogin({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { setCache },
	jwtUtil: { createAccessToken, createRefreshToken },
	repository: { createSocialUser, findOneSocialUserInfo },
});

export const refreshToken = Logic.refreshToken({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { deleteCache, getCache },
	jwtUtil: { createAccessToken, decodeToken, isExpiredToken },
});

export const deleteToken = Logic.deleteToken({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { deleteCache, getCache },
	jwtUtil: { decodeToken },
});
