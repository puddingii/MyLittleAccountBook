/** Service */
import { sendVerificationEmail } from '@/service/common/user/dependency';

/** Repository */
import {
	createEmailUser,
	createSocialUser,
	findOneSocialUserInfo,
	findOneUser,
} from '@/repository/authRepository/dependency';
import {
	findUserPrivacy,
	updateUserPrivacy,
} from '@/repository/userPrivacyRepository/dependency';

/** Util */
import { TErrorUtil, TCacheUtil, TJwtUtil } from '../util';
import { ISocialManager, TSocialType } from '../auth';
import { TAuthEventEmitter } from '../pubsub/auth';
import {
	getRedirectUrl,
	getSocialManager,
	getUserInfo,
} from '@/service/authService/socialManager';

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
		oauth: {
			getRedirectUrl: typeof getRedirectUrl;
			getSocialManager: typeof getSocialManager;
		};
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
		oauth: {
			getUserInfo: ReturnType<typeof getUserInfo>;
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
			findUserPrivacy: typeof findUserPrivacy;
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
			updateUserPrivacy: typeof updateUserPrivacy;
		};
	};
	param: {
		userEmail: string;
		emailState: string;
	};
};
