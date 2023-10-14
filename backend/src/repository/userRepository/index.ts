import { TFindUserInfo, TUpdateUserInfo } from '@/interface/repository/userRepository';

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

export const updateUserInfo =
	(dependencies: TUpdateUserInfo['dependency']) =>
	async (info: TUpdateUserInfo['param']) => {
		const {
			UserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { email, nickname } = info;
			const successCount = await UserModel.update({ nickname }, { where: { email } });

			return successCount;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};
