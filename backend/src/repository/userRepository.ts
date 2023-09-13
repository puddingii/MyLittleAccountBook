import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';
import { convertErrorToCustomError } from '@/util/error';

/** Email로 찾을 것 */
export const findUserInfo = async (
	info: Partial<{ email: string; nickname: string }>,
) => {
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

export const updateUserInfo = async (info: { email: string; nickname: string }) => {
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
