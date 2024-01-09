import { InferAttributes } from 'sequelize';

/** Model */
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';

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

export type TUpdateUserInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserModel: typeof UserModel;
	};
	param: RequiredPartial<InferAttributes<UserModel>, 'email'>;
};
