/** Repository */
import {
	findUserInfoWithPrivacyAndOAuth,
	updateUserInfo,
} from '@/repository/userRepository/dependency';

/** ETC */
import { TErrorUtil, TCacheUtil, TJwtUtil } from '../util';

export type TGetUserInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		repository: {
			findUserInfoWithPrivacyAndOAuth: typeof findUserInfoWithPrivacyAndOAuth;
		};
	};
	param: Partial<{ email: string; nickname: string }> & { myEmail: string };
};

export type TUpdateUserInfoAndRefreshToken = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError' | 'CustomError'>;
		cacheUtil: Pick<TCacheUtil, 'setCache'>;
		jwtUtil: Pick<TJwtUtil, 'createAccessToken' | 'createRefreshToken' | 'verifyAll'>;
		repository: {
			updateUserInfo: typeof updateUserInfo;
		};
	};
	param: {
		email: string;
		nickname: string;
		accessToken: string;
		refreshToken: string;
	};
};
