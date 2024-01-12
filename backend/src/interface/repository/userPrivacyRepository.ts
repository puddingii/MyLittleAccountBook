import { InferAttributes } from 'sequelize';

/** Model */
import UserPrivacyModel from '@/model/userPrivacy';

/** Util */
import { TErrorUtil } from '../util';
import { RequiredPartial } from '..';

export type TFindUserPrivacy = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserPrivacyModel: typeof UserPrivacyModel;
	};
	param: { userEmail: string };
};

export type TUpdateUserPrivacy = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserPrivacyModel: typeof UserPrivacyModel;
	};
	param: RequiredPartial<InferAttributes<UserPrivacyModel>, 'userEmail'>;
};
