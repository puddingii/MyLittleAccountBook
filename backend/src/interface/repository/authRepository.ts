import { Transaction } from 'sequelize';

/** Model */
import AccountBookModel from '@/model/accountBook';
import GroupModel from '@/model/group';
import CategoryModel from '@/model/category';
import UserModel from '@/model/user';
import OAuthUserModel from '@/model/oauthUser';

/** Util */
import { TDateUtil, TErrorUtil } from '../util';

/** ETC */
import defaultCategory from '@/json/defaultCategory.json';
import sequelize from '@/loader/mysql';
import { TSocialType } from '../auth';
import { TUserInfo } from '../user';

export type TCreateAccountBookAndGroup = {
	dependency: {
		dateUtil: Pick<TDateUtil, 'getCurrentDate'>;
		AccountBookModel: typeof AccountBookModel;
		CategoryModel: typeof CategoryModel;
		defaultCategory: typeof defaultCategory;
	};
	param: [newUser: UserModel, transaction: Transaction];
};

export type TCreateSocialUser = {
	dependency: {
		dateUtil: Pick<TDateUtil, 'getCurrentDate'>;
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookModel: typeof AccountBookModel;
		CategoryModel: typeof CategoryModel;
		UserModel: typeof UserModel;
		defaultCategory: typeof defaultCategory;
		sequelize: typeof sequelize;
	};
	param: { userInfo: { nickname: string; email: string }; socialType: TSocialType };
};

export type TCreateEmailUser = {
	dependency: {
		dateUtil: Pick<TDateUtil, 'getCurrentDate'>;
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		AccountBookModel: typeof AccountBookModel;
		CategoryModel: typeof CategoryModel;
		UserModel: typeof UserModel;
		defaultCategory: typeof defaultCategory;
		sequelize: typeof sequelize;
	};
	param: TUserInfo;
};

export type TFindOneUser = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserModel: typeof UserModel;
		GroupModel: typeof GroupModel;
	};
	param: Partial<TUserInfo>;
};

export type TFindOneSocialUserInfo = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		UserModel: typeof UserModel;
		GroupModel: typeof GroupModel;
		OAuthUserModel: typeof OAuthUserModel;
	};
	param: [userInfo: { email?: string; nickname?: string }, socialType: TSocialType];
};
