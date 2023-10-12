import { google } from 'googleapis';
import { nanoid } from 'nanoid/async';
import bcrypt from 'bcrypt';

import { getClient as getGoogleClient } from './socialManager/google';
import {
	getTokenInfo as getNaverTokenInfo,
	getUserInfo as getNaverUserInfo,
} from './socialManager/naver';
import { SOCIAL_URL_MANAGER } from './socialManager';

/** Util */
import { deleteCache, getCache } from '@/util/cache';
import secret from '@/config/secret';

/** Interface */
import { TDecodedAccessTokenInfo } from '@/interface/auth';
import {
	TDeleteToken,
	TEmailJoin,
	TEmailLogin,
	TGetSocialLoginLocation,
	TRefreshToken,
	TSocialLogin,
} from '@/interface/service/authService';

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
export const emailJoin =
	(dependencies: TEmailJoin['dependency']) => async (userInfo: TEmailJoin['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { createEmailUser },
		} = dependencies;
		try {
			const { accountBookId } = await createEmailUser(userInfo);

			return { accountBookId };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/** 이메일 로그인 */
export const emailLogin =
	(dependencies: TEmailLogin['dependency']) => async (userInfo: TEmailLogin['param']) => {
		const {
			cacheUtil: { setCache },
			errorUtil: { convertErrorToCustomError },
			jwtUtil: { createAccessToken, createRefreshToken },
			repository: { findOneUser },
		} = dependencies;

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
			const accessToken = createAccessToken({ nickname: user.nickname, email });

			await setCache(userInfo.email, refreshToken, secret.express.jwtRefreshTokenTime);

			return {
				refreshToken,
				accessToken,
				accountBookId: (user.groups ?? [])[0].accountBookId,
			};
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/** 소셜 로그인을 위한 Redirect 주소 반환 */
export const getSocialLoginLocation =
	(dependencies: TGetSocialLoginLocation['dependency']) =>
	async (type: TGetSocialLoginLocation['param']) => {
		const {
			cacheUtil: { setCache },
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const randomState = await nanoid(15);

			/** Social 로그인 시 검증하기 위한 State 발급 및 캐싱처리 */
			await setCache(randomState, 1, 600);

			return SOCIAL_URL_MANAGER[type](randomState);
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/** 소셜 전용 로그인 로직. 유저정보가 없는 경우 자동 회원가입, access/refresh token 발급하여 리턴 */
const socialLogin = async (
	dependencies: Omit<TSocialLogin['dependency'], 'errorUtil'>,
	info: {
		user: { email: string; nickname: string };
		type: 'Google' | 'Naver';
	},
) => {
	const {
		cacheUtil: { setCache },
		jwtUtil: { createAccessToken, createRefreshToken },
		repository: { createSocialUser, findOneSocialUserInfo },
	} = dependencies;
	const {
		user: { email },
		type,
	} = info;

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

	let accountBookId;
	if (user) {
		accountBookId = (user.groups ?? [])[0].accountBookId;
	} else {
		const { accountBookId: newAccountBookId } = await createSocialUser(info.user, type);
		accountBookId = newAccountBookId;
	}

	const refreshToken = createRefreshToken();
	const accessToken = createAccessToken({ email, nickname: user.nickname });

	await setCache(email, refreshToken, secret.express.jwtRefreshTokenTime);

	return { refreshToken, accessToken, accountBookId };
};

/** 구글 로그인 */
export const googleLogin =
	(dependencies: TSocialLogin['dependency']) => async (info: TSocialLogin['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			...commonDependencies
		} = dependencies;

		try {
			const { code, state } = info;
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
			const tokenInfo = await socialLogin(commonDependencies, {
				user: data,
				type: 'Google',
			});

			return tokenInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 403,
			});
			throw customError;
		}
	};

/** 네이버 로그인 */
export const naverLogin =
	(dependencies: TSocialLogin['dependency']) => async (info: TSocialLogin['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			...commonDependencies
		} = dependencies;

		try {
			const { code, state } = info;
			if (!isValidatedState(state)) {
				throw new Error('State 불일치. 재 로그인이 필요합니다.');
			}
			const naverTokenInfo = await getNaverTokenInfo(code, state);
			const { email, nickname } = await getNaverUserInfo(naverTokenInfo.access_token);

			const data = { email, nickname };
			const tokenInfo = await socialLogin(commonDependencies, {
				user: data,
				type: 'Naver',
			});

			return tokenInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 403,
			});
			throw customError;
		}
	};

export const refreshToken =
	(dependencies: TRefreshToken['dependency']) => async (info: TRefreshToken['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			cacheUtil: { deleteCache, getCache },
			jwtUtil: { createAccessToken, decodeToken, isExpiredToken },
		} = dependencies;

		try {
			const { accessToken, refreshToken } = info;
			const isExpiredRefreshToken = isExpiredToken(refreshToken);
			const isExpiredAccessToken = isExpiredToken(accessToken);
			/** Refresh token X, Access token X */
			if (isExpiredAccessToken && isExpiredRefreshToken) {
				throw new Error('로그인이 필요합니다.');
			}

			/** Access Token is '' */
			if (!accessToken) {
				throw new Error('로그인이 필요합니다.');
			}

			const decodedData = decodeToken<TDecodedAccessTokenInfo>(accessToken);
			if (!decodedData) {
				throw new Error('로그인이 필요합니다.');
			}

			/** Refresh token X, Access token O */
			if (isExpiredRefreshToken) {
				await deleteCache(decodedData.email);
				throw new Error('로그인이 필요합니다.');
			}

			/** Refresh token O, Access token X */
			const cachedRefreshToken = await getCache(decodedData.email);
			if (cachedRefreshToken !== refreshToken) {
				await deleteCache(decodedData.email);
				throw new Error('로그인이 필요합니다.');
			}

			const newAccessToken = createAccessToken({
				email: decodedData.email,
				nickname: decodedData.nickname,
			});

			return newAccessToken;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 401,
			});
			throw customError;
		}
	};

export const deleteToken =
	(dependencies: TDeleteToken['dependency']) => async (info: TDeleteToken['param']) => {
		const {
			cacheUtil: { deleteCache, getCache },
			errorUtil: { convertErrorToCustomError },
			jwtUtil: { decodeToken },
		} = dependencies;

		try {
			const { accessToken, refreshToken } = info;
			const decodedData = decodeToken<TDecodedAccessTokenInfo>(accessToken);
			if (!decodedData) {
				return;
			}

			const cachedRefreshToken = await getCache(decodedData.email);
			if (refreshToken === cachedRefreshToken) {
				await deleteCache(decodedData.email);
			}
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
