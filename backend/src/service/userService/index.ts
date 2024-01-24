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
			errorUtil: { convertErrorToCustomError, CustomError },
			repository: { findUserInfoWithPrivacyAndOAuth },
		} = dependencies;

		try {
			const { myEmail, ...user } = info;
			const userInfo = await findUserInfoWithPrivacyAndOAuth(user);

			if (!userInfo) {
				throw Error('이메일에 해당하는 유저를 찾을 수 없습니다.');
			}

			if (!userInfo.userprivacy) {
				throw new CustomError('DB Error(Join). 운영자에게 문의주세요.', { code: 500 });
			}

			/** Group에서 찾는게 아닌 개별로 조회시 isPublicUser===true 조건이 붙어야 제대로 조회 가능 */
			if (
				userInfo.userprivacy &&
				!userInfo.userprivacy.isPublicUser &&
				myEmail !== userInfo.email
			) {
				throw Error('해당 계정은 비공개 계정입니다.');
			}
			const socialType = (userInfo.oauthusers ?? [])[0]?.type ?? '';
			const isAuthenticated = userInfo.userprivacy.isAuthenticated;
			const isGroupInvitationOn = userInfo.userprivacy.isGroupInvitationOn;
			const isPublicUser = userInfo.userprivacy.isPublicUser;

			return {
				email: userInfo.email,
				nickname: userInfo.nickname,
				socialType,
				isAuthenticated,
				isGroupInvitationOn,
				isPublicUser,
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
