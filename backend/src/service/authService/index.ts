import { google } from 'googleapis';
import { nanoid } from 'nanoid/async';

import { getClient as getGoogleClient, getUrl as getGoogleUrl } from './googleManager';
import {
	getTokenInfo as getNaverTokenInfo,
	getUrl as getNaverUrl,
	getUserInfo as getNaverUserInfo,
} from './naverManager';
import UserModel from '@/model/user';
import { convertErrorToCustomError } from '@/util/error';
import { deleteCache, getCache, setCache } from '@/util/cache';
import { createAccessToken, createRefreshToken } from '@/util/jwt';

type TSocialLogin = 'Google' | 'Naver';

const SOCIAL_URL_MANAGER = {
	Google: getGoogleUrl,
	Naver: getNaverUrl,
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

const createTokenAndCaching = async (
	userInfo: { email: string; nickname: string },
	type: 'Default' | 'Google' | 'Naver',
) => {
	try {
		const { email } = userInfo;

		const isExistedUser = await UserModel.findOne({ where: { email } });
		/** 유저 계정이 없는 경우 */
		if (!isExistedUser) {
			const newUser = await UserModel.create(userInfo);
			await newUser.createOauthuser({ type });
		}

		const refreshToken = createRefreshToken();
		const accessToken = createAccessToken(userInfo);

		await setCache(userInfo.email, refreshToken, 60 * 60 * 24 * 14);

		return { refreshToken, accessToken };
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

/** FIXME test code */
export const emailLogin = async () => {
	const a = await UserModel.create({ email: 'asd', nickname: 'sdf', password: 'asf' });

	const s = await a.createOauthuser({ type: 'ss' });
	return s;
};

export const getSocialLoginLocation = async (type: TSocialLogin) => {
	try {
		const randomState = await nanoid(15);
		await setCache(randomState, 1, 600);

		return SOCIAL_URL_MANAGER[type](randomState);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

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
		const tokenInfo = createTokenAndCaching(data, 'Google');

		return tokenInfo;
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

export const naverLogin = async (code: string, state: string) => {
	try {
		if (!isValidatedState(state)) {
			throw new Error('State 불일치. 재 로그인이 필요합니다.');
		}
		const naverTokenInfo = await getNaverTokenInfo(code, state);
		const { email, nickname } = await getNaverUserInfo(naverTokenInfo.access_token);

		const data = { email, nickname };
		const tokenInfo = createTokenAndCaching(data, 'Naver');

		return tokenInfo;
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};
