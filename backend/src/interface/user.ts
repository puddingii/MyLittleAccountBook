import CategoryModel from '@/model/category';
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';

export type TUserInfo = { nickname: string; email: string; password: string };

export type TModelInfo = {
	OAuthUserModel: typeof OAuthUserModel;
	UserModel: typeof UserModel;
	CategoryModel: typeof CategoryModel;
};
