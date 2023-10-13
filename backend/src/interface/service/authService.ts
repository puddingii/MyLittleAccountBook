/** Repository */
import {
	createEmailUser,
	createSocialUser,
	findOneSocialUserInfo,
	findOneUser,
} from '@/repository/authRepository/dependency';

/** Util */
import { TErrorUtil, TCacheUtil, TJwtUtil } from '../util';
import { TSocialType } from '../auth';

export type TEmailJoin = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			createEmailUser: typeof createEmailUser;
		};
	};
	param: {
		email: string;
		password: string;
		nickname: string;
	};
};

export type TEmailLogin = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		jwtUtil: Pick<TJwtUtil, 'createAccessToken' | 'createRefreshToken'>;
		cacheUtil: Pick<TCacheUtil, 'setCache'>;
		repository: {
			findOneUser: typeof findOneUser;
		};
	};
	param: { email: string; password: string };
};

export type TGetSocialLoginLocation = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		cacheUtil: Pick<TCacheUtil, 'setCache'>;
	};
	param: TSocialType;
};

export type TSocialLogin = {
	dependency: {
		jwtUtil: Pick<TJwtUtil, 'createAccessToken' | 'createRefreshToken'>;
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		cacheUtil: Pick<TCacheUtil, 'setCache'>;
		repository: {
			findOneSocialUserInfo: typeof findOneSocialUserInfo;
			createSocialUser: typeof createSocialUser;
		};
	};
	param: { code: string; state: string };
};

export type TRefreshToken = {
	dependency: {
		jwtUtil: Pick<TJwtUtil, 'createAccessToken' | 'isExpiredToken' | 'decodeToken'>;
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		cacheUtil: Pick<TCacheUtil, 'deleteCache' | 'getCache'>;
	};
	param: { refreshToken: string; accessToken: string };
};

export type TDeleteToken = {
	dependency: {
		jwtUtil: Pick<TJwtUtil, 'decodeToken'>;
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		cacheUtil: Pick<TCacheUtil, 'deleteCache' | 'getCache'>;
	};
	param: { refreshToken: string; accessToken: string };
};
