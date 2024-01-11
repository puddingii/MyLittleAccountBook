/** Library */

/** Interface */
import { TGet } from '@/interface/api/response/userResponse';
import {
	TGetUserInfo,
	TUpdateUserInfoAndRefreshToken,
} from '@/interface/service/userService';

/** Etc */
import secret from '@/config/secret';

export const getUserInfo =
	(dependencies: TGetUserInfo['dependency']) => async (info: TGetUserInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findUserInfo },
		} = dependencies;

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
				isAuthenticated: userInfo.isAuthenticated,
			} satisfies TGet['data'];
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const updateUserInfoAndRefreshToken =
	(dependencies: TUpdateUserInfoAndRefreshToken['dependency']) =>
	async (info: TUpdateUserInfoAndRefreshToken['param']) => {
		const {
			errorUtil: { CustomError, convertErrorToCustomError },
			cacheUtil: { setCache },
			jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
			repository: { updateUserInfo },
		} = dependencies;

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
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
