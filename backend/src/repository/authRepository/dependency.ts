import * as Logic from '.';

/** Model */
import AccountBookModel from '@/model/accountBook';
import GroupModel from '@/model/group';
import CategoryModel from '@/model/category';
import UserModel from '@/model/user';
import OAuthUserModel from '@/model/oauthUser';

import { convertErrorToCustomError } from '@/util/error';
import { getCurrentDate } from '@/util/date';
import defaultCategory from '@/json/defaultCategory.json';
import sequelize from '@/loader/mysql';

export const createSocialUser = Logic.createSocialUser({
	AccountBookModel,
	CategoryModel,
	defaultCategory,
	UserModel,
	errorUtil: { convertErrorToCustomError },
	dateUtil: { getCurrentDate },
	sequelize,
});

export const createEmailUser = Logic.createEmailUser({
	AccountBookModel,
	CategoryModel,
	defaultCategory,
	UserModel,
	errorUtil: { convertErrorToCustomError },
	dateUtil: { getCurrentDate },
});

export const findOneUser = Logic.findOneUser({
	GroupModel,
	UserModel,
	errorUtil: { convertErrorToCustomError },
});

export const findOneSocialUserInfo = Logic.findOneSocialUserInfo({
	GroupModel,
	OAuthUserModel,
	UserModel,
	errorUtil: { convertErrorToCustomError },
});
