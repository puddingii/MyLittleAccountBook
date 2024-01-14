import { Op } from 'sequelize';

import {
	TFindInviteEnableUserInfoList,
	TFindUserInfo,
	TFindUserInfoWithPrivacy,
	TFindUserInfoWithPrivacyAndOAuth,
	TUpdateUserInfo,
} from '@/interface/repository/userRepository';

/** Email로 찾을 것 */
export const findUserInfo =
	(dependencies: TFindUserInfo['dependency']) => async (info: TFindUserInfo['param']) => {
		const {
			OAuthUserModel,
			UserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const userInfo = await UserModel.findOne({
				where: info,
				include: {
					model: OAuthUserModel,
					as: 'oauthusers',
					/** inner join */
				},
				subQuery: false,
			});

			return userInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};

export const findUserInfoWithPrivacy =
	(dependencies: TFindUserInfoWithPrivacy['dependency']) =>
	async (info: TFindUserInfoWithPrivacy['param']) => {
		const {
			UserModel,
			UserPrivacyModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const userInfo = await UserModel.findOne({
				where: info,
				include: {
					model: UserPrivacyModel,
					as: 'userprivacy',
					/** inner join */
				},
				subQuery: false,
			});

			return userInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};

export const findUserInfoWithPrivacyAndOAuth =
	(dependencies: TFindUserInfoWithPrivacyAndOAuth['dependency']) =>
	async (info: TFindUserInfoWithPrivacyAndOAuth['param']) => {
		const {
			UserModel,
			OAuthUserModel,
			UserPrivacyModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const userInfo = await UserModel.findOne({
				where: info,
				include: [
					{
						model: UserPrivacyModel,
						as: 'userprivacy',
					},
					{
						model: OAuthUserModel,
						as: 'oauthusers',
					},
				],
				subQuery: false,
			});

			return userInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};

export const findInviteEnableUserInfoList =
	(dependencies: TFindInviteEnableUserInfoList['dependency']) =>
	async (
		info: TFindInviteEnableUserInfoList['param'][0],
		transaction?: TFindInviteEnableUserInfoList['param'][1],
	) => {
		const {
			UserModel,
			UserPrivacyModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const nameWhere = info.length ? { [Op.or]: info } : {};
			const userList = await UserModel.findAll({
				where: nameWhere,
				include: {
					model: UserPrivacyModel,
					as: 'userprivacy',
					required: true,
					where: { isGroupInvitationOn: true, isAuthenticated: true },
				},
				subQuery: false,
				transaction,
			});

			return userList;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};

export const updateUserInfo =
	(dependencies: TUpdateUserInfo['dependency']) =>
	async (info: TUpdateUserInfo['param']) => {
		const {
			UserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { email, ...rest } = info;
			const successCount = await UserModel.update(rest, { where: { email } });

			return successCount;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};
