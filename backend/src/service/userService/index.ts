/** Library */

/** Repository */
import { findUserInfo, updateUserInfo } from '@/repository/userRepository';

/** Sub Service */

/** Interface */
import { TGet } from '@/interface/api/response/userResponse';

/** Etc */
import { convertErrorToCustomError } from '@/util/error';
import { createAccessToken, createRefreshToken, verifyAll } from '@/util/jwt';
import { setCache } from '@/util/cache';
import { CustomError } from '@/util/error/class';
import secret from '@/config/secret';

export const getUserInfo = async (info: Partial<{ email: string; nickname: string }>) => {
	try {
		const userInfo = await findUserInfo(info);

		if (!userInfo) {
			throw Error('이메일에 해당하는 유저를 찾을 수 없습니다.');
		}
		const socialType = (userInfo.oauthusers ?? [])[0]?.type ?? '';

		return {
			email: userInfo.email,
			nickname: userInfo.nickname,
			socialType,
		} as TGet['data'];
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const updateUserInfoAndRefreshToken = async (info: {
	email: string;
	nickname: string;
	accessToken: string;
	refreshToken: string;
}) => {
	try {
		const { email, nickname, accessToken, refreshToken } = info;
		const updatedCount = await updateUserInfo({ email, nickname });
		if (updatedCount[0] !== 1) {
			throw new CustomError(
				'정상적으로 업데이트 되지 않았습니다. 재 로그인 후 시도하거나 문의 부탁드립니다.',
				{ code: 500 },
			);
		}

		await verifyAll({
			accessToken,
			refreshToken,
		});

		const newRefreshToken = createRefreshToken();
		const newAccessToken = createAccessToken({ nickname, email });

		await setCache(email, newRefreshToken, secret.express.jwtRefreshTokenTime);

		return { accessToken: newAccessToken, refreshToken: newRefreshToken };
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
