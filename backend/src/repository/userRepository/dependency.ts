import * as Logic from '.';

/** Model */
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const findUserInfo = Logic.findUserInfo({
	errorUtil: { convertErrorToCustomError },
	OAuthUserModel,
	UserModel,
});

export const updateUserInfo = Logic.updateUserInfo({
	errorUtil: { convertErrorToCustomError },
	UserModel,
});
