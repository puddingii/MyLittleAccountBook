import * as Logic from '.';

/** Model */
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';
import UserPrivacyModel from '@/model/userPrivacy';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const findUserInfo = Logic.findUserInfo({
	errorUtil: { convertErrorToCustomError },
	OAuthUserModel,
	UserModel,
});

export const findUserInfoWithPrivacy = Logic.findUserInfoWithPrivacy({
	errorUtil: { convertErrorToCustomError },
	UserPrivacyModel,
	UserModel,
});

export const findInviteEnableUserInfoList = Logic.findInviteEnableUserInfoList({
	errorUtil: { convertErrorToCustomError },
	UserPrivacyModel,
	UserModel,
});

export const updateUserInfo = Logic.updateUserInfo({
	errorUtil: { convertErrorToCustomError },
	UserModel,
});
