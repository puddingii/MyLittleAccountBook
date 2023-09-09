import UserModel from '@/model/user';
import { convertErrorToCustomError } from '@/util/error';

/** Email로 찾을 것 */
export const findUserInfo = async (
	info: Partial<{ email: string; nickname: string }>,
) => {
	try {
		const userInfo = await UserModel.findOne({ where: info });

		return userInfo;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};
