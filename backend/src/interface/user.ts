import AccountBookModel from '@/model/accountBook';
import CategoryModel from '@/model/category';
import GroupModel from '@/model/group';
import GroupAccountBookModel from '@/model/groupAccountBook';
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';

export type TUserInfo = { nickname: string; email: string; password: string };

export type TModelInfo = {
	OAuthUserModel: typeof OAuthUserModel;
	UserModel: typeof UserModel;
	CategoryModel: typeof CategoryModel;
	AccountBookModel: typeof AccountBookModel;
	GroupModel: typeof GroupModel;
	GroupAccountBookModel: typeof GroupAccountBookModel;
};
