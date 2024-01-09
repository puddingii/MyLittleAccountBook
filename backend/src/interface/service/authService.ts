/** Service */
import { sendVerificationEmail } from '@/service/common/user/dependency';

/** Repository */
import {
	createEmailUser,
	createSocialUser,
	findOneSocialUserInfo,
	findOneUser,
} from '@/repository/authRepository/dependency';
import { updateUserInfo } from '@/repository/userRepository/dependency';

/** Util */
import { TErrorUtil, TCacheUtil, TJwtUtil } from '../util';
import { TSocialType } from '../auth';
import { TAuthEventEmitter } from '../pubsub/auth';

export type TEmailJoin = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		eventEmitter: TAuthEventEmitter;
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
		cacheUtil: Pick<TCacheUtil, 'setCache' | 'getCache' | 'deleteCache'>;
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

export type TResendVerificationEmail = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		repository: {
			findOneUser: typeof findOneUser;
		};
		service: {
			sendVerificationEmail: typeof sendVerificationEmail;
		};
	};
	param: { userEmail: string; userNickname: string };
};

export type TVerifyEmail = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		cacheUtil: Pick<TCacheUtil, 'deleteCache' | 'getCache'>;
		repository: {
			updateUserInfo: typeof updateUserInfo;
		};
	};
	param: {
		userEmail: string;
		emailState: string;
	};
};
