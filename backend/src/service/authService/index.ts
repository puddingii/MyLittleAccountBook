import { google } from 'googleapis';
import { nanoid } from 'nanoid/async';
import bcrypt from 'bcrypt';

import { getClient as getGoogleClient, getUrl as getGoogleUrl } from './googleManager';
import {
	getTokenInfo as getNaverTokenInfo,
	getUrl as getNaverUrl,
	getUserInfo as getNaverUserInfo,
} from './naverManager';
import {
	createEmailUser,
	createSocialUser,
	findOneSocialUserInfo,
	findOneUser,
} from '@/repository/userRepository';
import { convertErrorToCustomError } from '@/util/error';
import { deleteCache, getCache, setCache } from '@/util/cache';
import {
	createAccessToken,
	createRefreshToken,
	decodeToken,
	isExpiredToken,
} from '@/util/jwt';
import secret from '@/config/secret';

import { TDecodedAccessTokenInfo, TSocialType } from '@/interface/auth';

const SOCIAL_URL_MANAGER = {
	Google: getGoogleUrl,
	Naver: getNaverUrl,
};

/** Social 로그인 시 검증하기 위한 State 발급 및 캐싱처리 */
const getRandomStateAndCaching = async (time = 600) => {
	const randomState = await nanoid(15);
	await setCache(randomState, 1, time);

	return randomState;
};

/** Refresh Token - Access Token 의 유효성 검증 */
const isValidatedState = async (state?: string) => {
	if (!state) {
		return false;
	}
	const savedState = await getCache(state);

	if (savedState) {
		await deleteCache(state);
	}

	return !!savedState;
};

/** 이메일 회원가입(패스워드 가입) */
export const emailJoin = async (userInfo: {
	email: string;
	password: string;
	nickname: string;
}) => {
	try {
		const [, created] = await createEmailUser(userInfo);
		if (!created) {
			throw new Error('해당 이메일로 생성된 계정이 있습니다.');
		}
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

/** 이메일 로그인 */
export const emailLogin = async (userInfo: { email: string; password: string }) => {
	try {
		const { email, password } = userInfo;

		const user = await findOneUser({ email });

		/** 유저 계정이 없는 경우 */
		if (user === null) {
			throw new Error('없는 계정입니다. 회원가입 후 이용해주세요.');
		}
		/** 비밀번호가 없는 경우는 소셜 로그인 계정 */
		if (!user.password) {
			throw new Error(`소셜 로그인 계정입니다.`);
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			throw new Error('비밀번호가 일치하지 않습니다.');
		}

		const refreshToken = createRefreshToken();
		const accessToken = createAccessToken(userInfo);

		await setCache(userInfo.email, refreshToken, secret.express.jwtRefreshTokenTime);

		return { refreshToken, accessToken };
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

/** 소셜 로그인을 위한 Redirect 주소 반환 */
export const getSocialLoginLocation = async (type: TSocialType) => {
	try {
		const randomState = await getRandomStateAndCaching();

		return SOCIAL_URL_MANAGER[type](randomState);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

/** 소셜 전용 로그인 로직. 유저정보가 없는 경우 자동 회원가입, access/refresh token 발급하여 리턴 */
const socialLogin = async (
	userInfo: { email: string; nickname: string },
	type: 'Google' | 'Naver',
) => {
	try {
		const { email } = userInfo;

		const user = await findOneSocialUserInfo({ email }, type);
		/**
		 * 1. User Table O, OAuth Table O => Login
		 * 2. User Table O, OAuth Table X => Email Login Required
		 * 3. User Table X, OAuth Table O => Bug(User - OAuthuser Cascade)
		 * 4. User Table X, OAuth Table X => Create New User
		 */
		if (user && !user.oauthusers) {
			throw new Error('소셜 로그인 계정이 아닙니다.');
		}
		if (user === null) {
			await createSocialUser(userInfo, type);
		}

		const refreshToken = createRefreshToken();
		const accessToken = createAccessToken(userInfo);

		await setCache(userInfo.email, refreshToken, secret.express.jwtRefreshTokenTime);

		return { refreshToken, accessToken };
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

/** 구글 로그인 */
export const googleLogin = async (code: string, state: string) => {
	try {
		if (!isValidatedState(state)) {
			throw new Error('State 불일치. 재 로그인이 필요합니다.');
		}

		const client = getGoogleClient();
		const { tokens } = await client.getToken(code);
		client.setCredentials(tokens);

		const {
			data: { email, verified_email: verfiedEmail },
		} = await google.oauth2('v2').userinfo.get({
			auth: client,
		});

		if (!email || !verfiedEmail) {
			throw new Error('안전한 계정이 아닙니다. 다른 계정으로 이용해주세요.');
		}

		const data = { email, nickname: email.split('@')[0] };
		const tokenInfo = socialLogin(data, 'Google');

		return tokenInfo;
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

/** 네이버 로그인 */
export const naverLogin = async (code: string, state: string) => {
	try {
		if (!isValidatedState(state)) {
			throw new Error('State 불일치. 재 로그인이 필요합니다.');
		}
		const naverTokenInfo = await getNaverTokenInfo(code, state);
		const { email, nickname } = await getNaverUserInfo(naverTokenInfo.access_token);

		const data = { email, nickname };
		const tokenInfo = socialLogin(data, 'Naver');

		return tokenInfo;
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

export const refreshToken = async (refreshToken: string, accessToken: string) => {
	const isExpiredRefreshToken = isExpiredToken(refreshToken);
	const isExpiredAccessToken = isExpiredToken(accessToken);
	/** Refresh token X, Access token X */
	if (isExpiredAccessToken && isExpiredRefreshToken) {
		throw new Error('로그인이 필요합니다.');
	}

	const decodedData = decodeToken<TDecodedAccessTokenInfo>(accessToken);
	/** Refresh token X, Access token O */
	if (isExpiredRefreshToken) {
		await deleteCache(decodedData.email);
		throw new Error('로그인이 필요합니다.');
	}

	/** Refresh token O, Access token X */
	const newAccessToken = createAccessToken(decodedData);

	return newAccessToken;
};
