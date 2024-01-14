import { InferAttributes, Transaction } from 'sequelize';

/** Model */
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';
import UserPrivacyModel from '@/model/userPrivacy';

/** Util */
import { TErrorUtil } from '../util';
import { RequiredPartial } from '..';

export type TFindUserInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserModel: typeof UserModel;
		OAuthUserModel: typeof OAuthUserModel;
	};
	param: Partial<{ email: string; nickname: string }>;
};

export type TFindUserInfoWithPrivacy = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserModel: typeof UserModel;
		UserPrivacyModel: typeof UserPrivacyModel;
	};
	param: Partial<{ email: string; nickname: string }>;
};

export type TFindUserInfoWithPrivacyAndOAuth = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserModel: typeof UserModel;
		UserPrivacyModel: typeof UserPrivacyModel;
		OAuthUserModel: typeof OAuthUserModel;
	};
	param: Partial<{ email: string; nickname: string }>;
};

export type TFindInviteEnableUserInfoList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserModel: typeof UserModel;
		UserPrivacyModel: typeof UserPrivacyModel;
	};
	param: [emailList: Array<{ email: string }>, transaction?: Transaction];
};

export type TUpdateUserInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserModel: typeof UserModel;
	};
	param: RequiredPartial<InferAttributes<UserModel>, 'email'>;
};
