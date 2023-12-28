import * as Logic from '.';

/** Repository */
import {
	createEmailUser,
	createSocialUser,
	findOneSocialUserInfo,
	findOneUser,
} from '@/repository/authRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import {
	createRefreshToken,
	createAccessToken,
	decodeToken,
	isExpiredToken,
} from '@/util/jwt';
import {
	deleteRefreshTokenCache,
	deleteSocialLoginStateCache,
	getRefreshTokenCache,
	getSocialLoginStateCache,
	setRefreshTokenCache,
	setSocialLoginStateCache,
} from '@/util/cache/v2';
import authEmitter from '@/util/pubsub/authPubsub';

export const emailJoin = Logic.emailJoin({
	errorUtil: { convertErrorToCustomError },
	eventEmitter: authEmitter,
	repository: { createEmailUser },
});

export const emailLogin = Logic.emailLogin({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { setCache: setRefreshTokenCache },
	jwtUtil: { createAccessToken, createRefreshToken },
	repository: { findOneUser },
});

export const getSocialLoginLocation = Logic.getSocialLoginLocation({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { setCache: setSocialLoginStateCache },
});

export const googleLogin = Logic.googleLogin({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: {
		setCache: setRefreshTokenCache,
		getCache: getSocialLoginStateCache,
		deleteCache: deleteSocialLoginStateCache,
	},
	jwtUtil: { createAccessToken, createRefreshToken },
	repository: { createSocialUser, findOneSocialUserInfo },
});

export const naverLogin = Logic.naverLogin({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: {
		setCache: setRefreshTokenCache,
		getCache: getSocialLoginStateCache,
		deleteCache: deleteSocialLoginStateCache,
	},
	jwtUtil: { createAccessToken, createRefreshToken },
	repository: { createSocialUser, findOneSocialUserInfo },
});

export const refreshToken = Logic.refreshToken({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { deleteCache: deleteRefreshTokenCache, getCache: getRefreshTokenCache },
	jwtUtil: { createAccessToken, decodeToken, isExpiredToken },
});

export const deleteToken = Logic.deleteToken({
	errorUtil: { convertErrorToCustomError },
	cacheUtil: { deleteCache: deleteRefreshTokenCache, getCache: getRefreshTokenCache },
	jwtUtil: { decodeToken },
});
