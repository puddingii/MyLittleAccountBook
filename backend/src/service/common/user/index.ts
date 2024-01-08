/** Library */
import { nanoid } from 'nanoid/async';

/** Interface */
import {
	TCheckAdminGroupUser,
	TSendVerificationEmail,
} from '@/interface/service/commonUserService';

/** ETC */
import secret from '@/config/secret';

export const checkAdminGroupUser =
	(dependencies: TCheckAdminGroupUser['dependency']) =>
	async (info: TCheckAdminGroupUser['param']) => {
		const {
			validationUtil: { isAdminUser },
			repository: { findGroup },
		} = dependencies;

		const { userEmail, accountBookId } = info;
		const myGroupInfo = await findGroup({
			userEmail,
			accountBookId,
		});
		if (!myGroupInfo) {
			throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
		}
		if (!isAdminUser(myGroupInfo.userType)) {
			throw new Error('관리 가능한 계정이 아닙니다.');
		}

		return myGroupInfo;
	};

export const sendVerificationEmail =
	(dependencies: TSendVerificationEmail['dependency']) =>
	async (info: TSendVerificationEmail['param']) => {
		const {
			cacheUtil: { setCache, getCache },
			mailUtil: { getBuilder, getVerifyMailHTML },
		} = dependencies;
		const { userEmail, userNickname } = info;

		/** Check request count */
		const cacheData = await getCache(userEmail);
		const requestCount = cacheData ? parseInt(cacheData.at(-1) ?? '0', 10) : 0;
		/** If many requests in a short period of time, restrict mail verification */
		if (cacheData && requestCount >= 5) {
			return false;
		}

		/** Get random state(Email verification, expire in 10min) */
		const randomState = await nanoid(15);
		const state = `${randomState}${requestCount + 1}`;
		await setCache(userEmail, state, 600);

		/** Mail Send(Include random state) */
		const verifyEmailHref = `${secret.frontUrl}/verify?state=${state}`;
		const mailerBuilder = getBuilder();
		const mailer = mailerBuilder
			.setDefaultFromEmail()
			.setDefaultMailOptions({ to: userEmail, subject: '나의 작은 가계부 메일인증' })
			.setMailContent(getVerifyMailHTML(verifyEmailHref, userNickname))
			.build();

		await mailer.sendMail();

		return true;
	};
