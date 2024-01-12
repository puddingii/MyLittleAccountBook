import AccountBookModel from '@/model/accountBook';
import CategoryModel from '@/model/category';
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupModel from '@/model/group';
import GroupAccountBookModel from '@/model/groupAccountBook';
import NoticeModel from '@/model/notice';
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';
import UserPrivacyModel from '@/model/userPrivacy';

export type TModelInfo = {
	oauthusers: typeof OAuthUserModel;
	users: typeof UserModel;
	categorys: typeof CategoryModel;
	accountbooks: typeof AccountBookModel;
	groups: typeof GroupModel;
	groupaccountbooks: typeof GroupAccountBookModel;
	crongroupaccountbooks: typeof CronGroupAccountBookModel;
	notices: typeof NoticeModel;
	userprivacys: typeof UserPrivacyModel;
};
