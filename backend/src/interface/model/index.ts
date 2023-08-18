import AccountBookModel from '@/model/accountBook';
import CategoryModel from '@/model/category';
import GroupModel from '@/model/group';
import GroupAccountBookModel from '@/model/groupAccountBook';
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';

export type TModelInfo = {
	oauthusers: typeof OAuthUserModel;
	users: typeof UserModel;
	categorys: typeof CategoryModel;
	accountbooks: typeof AccountBookModel;
	groups: typeof GroupModel;
	groupaccountbooks: typeof GroupAccountBookModel;
};
