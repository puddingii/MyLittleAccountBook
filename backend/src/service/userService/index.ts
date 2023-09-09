/** Library */

/** Repository */
import { findUserInfo } from '@/repository/userRepository';

/** Sub Service */

/** Interface */
import { TGet } from '@/interface/api/response/userResponse';

/** Etc */
import { convertErrorToCustomError } from '@/util/error';

export const getUserInfo = async (info: Partial<{ email: string; nickname: string }>) => {
	try {
		const userInfo = await findUserInfo(info);

		if (!userInfo) {
			throw Error('이메일에 해당하는 유저를 찾을 수 없습니다.');
		}

		return { email: userInfo.email, nickname: userInfo.nickname } as TGet['data'];
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
