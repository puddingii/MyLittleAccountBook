import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

/** Util */
import secret from '@/config/secret';

/** Interface */
import { TDecodedAccessTokenInfo } from '@/interface/auth';
import {
	TDeleteToken,
	TEmailJoin,
	TEmailLogin,
	TGetSocialLoginLocation,
	TRefreshToken,
	TResendVerificationEmail,
	TSocialLogin,
	TVerifyEmail,
} from '@/interface/service/authService';

/** Refresh Token - Access Token 의 유효성 검증 */
export const isValidatedState = async (
	dependency: Pick<TSocialLogin['dependency']['cacheUtil'], 'getCache' | 'deleteCache'>,
	state?: string,
) => {
	const { getCache, deleteCache } = dependency;
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
			eventEmitter,
			repository: { createEmailUser },
		} = dependencies;
		try {
			const { accountBookId } = await createEmailUser(userInfo);

			eventEmitter.emit('join', { email: userInfo.email, nickname: userInfo.nickname });

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
			if (!user) {
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
				accountBookId: (user.groups ?? [])[0]?.accountBookId,
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
			oauth: { getRedirectUrl, getSocialManager },
		} = dependencies;

		try {
			const randomState = nanoid(15);

			/** Social 로그인 시 검증하기 위한 State 발급 및 캐싱처리 */
			await setCache(randomState, 1, 600);
			const getRedirectSocialUrl = getRedirectUrl(getSocialManager(type));

			return getRedirectSocialUrl(randomState);
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/** 소셜 전용 로그인 로직. 유저정보가 없는 경우 자동 회원가입, access/refresh token 발급하여 리턴 */
export const socialLogin = async (
	dependencies: Pick<TSocialLogin['dependency'], 'jwtUtil' | 'repository'> & {
		cacheUtil: Pick<TSocialLogin['dependency']['cacheUtil'], 'setCache'>;
	},
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

	let user = await findOneSocialUserInfo({ email }, type);
	/**
	 * 1. User Table O, OAuth Table O => Login
	 * 2. User Table O, OAuth Table X => Email Login Required
	 * 3. User Table X, OAuth Table O => Bug(User - OAuthuser Cascade)
	 * 4. User Table X, OAuth Table X => Create New User
	 */
	if (user && !user.oauthusers) {
		throw new Error('소셜 로그인 계정이 아닙니다.');
	}

	let accountBookId: number;
	if (user) {
		accountBookId = (user.groups ?? [])[0]?.accountBookId;
	} else {
		const { accountBookId: newAccountBookId, newUser } = await createSocialUser({
			userInfo: info.user,
			socialType: type,
		});
		accountBookId = newAccountBookId;
		user = newUser;
	}

	const refreshToken = createRefreshToken();
	const accessToken = createAccessToken({ email, nickname: user.nickname });

	await setCache(email, refreshToken, secret.express.jwtRefreshTokenTime);

	return { refreshToken, accessToken, accountBookId };
};

/** 구글 로그인 */
/* istanbul ignore next */
export const googleLogin =
	(dependencies: TSocialLogin['dependency']) => async (info: TSocialLogin['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			cacheUtil: { deleteCache, getCache, setCache },
			oauth: { getUserInfo },
			...commonDependencies
		} = dependencies;

		try {
			const { code, state } = info;
			const isValidState = await isValidatedState({ deleteCache, getCache }, state);
			if (!isValidState) {
				throw new Error('State 불일치. 재 로그인이 필요합니다.');
			}

			const data = await getUserInfo({ code, state });
			const tokenInfo = await socialLogin(
				{ ...commonDependencies, cacheUtil: { setCache } },
				{
					user: data,
					type: 'Google',
				},
			);

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
/* istanbul ignore next */
export const naverLogin =
	(dependencies: TSocialLogin['dependency']) => async (info: TSocialLogin['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			cacheUtil: { deleteCache, getCache, setCache },
			oauth: { getUserInfo },
			...commonDependencies
		} = dependencies;

		try {
			const { code, state } = info;
			const isValidState = await isValidatedState({ deleteCache, getCache }, state);
			if (!isValidState) {
				throw new Error('State 불일치. 재 로그인이 필요합니다.');
			}

			const data = await getUserInfo({ code, state });
			const tokenInfo = await socialLogin(
				{ ...commonDependencies, cacheUtil: { setCache } },
				{
					user: data,
					type: 'Naver',
				},
			);

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

/**
 * @return 0-요청 카운트 초과, 1-정상
 */
export const resendVerificationEmail =
	(dependencies: TResendVerificationEmail['dependency']) =>
	async (info: TResendVerificationEmail['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findUserPrivacy },
			service: { sendVerificationEmail },
		} = dependencies;

		try {
			const user = await findUserPrivacy({ userEmail: info.userEmail });
			if (!user) {
				throw new Error('없는 계정입니다. 회원가입 후 이용해주세요.');
			}

			if (user.isAuthenticated) {
				throw new Error('이미 인증된 유저입니다.');
			}

			const hasSendEmail = await sendVerificationEmail(info);

			return {
				code: Number(hasSendEmail),
				message: hasSendEmail
					? `"${info.userEmail}"에 인증 이메일이 발송되었습니다.`
					: '최근에 너무 많은 요청을 하여, 잠시 인증이 제한되었습니다.',
			};
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/**
 * @return 1-정상, 2-인증문자 만료, 3-인증문자 비일치
 */
export const verifyEmail =
	(dependencies: TVerifyEmail['dependency']) => async (info: TVerifyEmail['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			cacheUtil: { deleteCache, getCache },
			repository: { updateUserPrivacy },
		} = dependencies;

		try {
			const { userEmail, emailState } = info;

			/** Check request count */
			const cacheData = await getCache(userEmail);
			if (!cacheData) {
				/** 인증 문자 만료 */
				return { code: 2 };
			}
			if (emailState !== cacheData) {
				/** 인증 문자 비일치 */
				return { code: 3 };
			}

			/** DB update 후 캐시 제거 */
			await updateUserPrivacy({ userEmail: info.userEmail, isAuthenticated: true });
			await deleteCache(userEmail);

			return { code: 1 };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
