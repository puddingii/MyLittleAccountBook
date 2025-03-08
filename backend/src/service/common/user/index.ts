/** Library */
import { nanoid } from 'nanoid';

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

const getRequestCount = (str: string | null) => {
	const countStr = str?.at(-1) ?? '0';

	return parseInt(countStr, 10);
};

const canSendEmail = (requestCount: number) => {
	return requestCount < 5;
};

const getRandomState = (requestCount: number) => {
	const randomState = nanoid(15);
	const state = `${randomState}${requestCount + 1}`;

	return state;
};

/** Email send logic */
const sendMail = async (
	dependencies: TSendVerificationEmail['dependency']['mailUtil'],
	info: TSendVerificationEmail['param'] & { state: string },
) => {
	const { userEmail, userNickname, state } = info;
	const { getBuilder, getVerifyMailHTML } = dependencies;

	const verifyEmailHref = `${secret.frontUrl}/auth/email?state=${state}&email=${userEmail}`;
	const mailerBuilder = getBuilder();
	const mailer = mailerBuilder
		.setDefaultFromEmail()
		.setDefaultMailOptions({ to: userEmail, subject: '나의 작은 가계부 메일인증' })
		.setMailContent(getVerifyMailHTML(verifyEmailHref, userNickname))
		.build();

	await mailer.sendMail();
};

/** 인증 메일 재전송 로직. 메일을 성공적으로 보낼 시 true값 리턴 */
export const sendVerificationEmail =
	(dependencies: TSendVerificationEmail['dependency']) =>
	async (info: TSendVerificationEmail['param']) => {
		const {
			cacheUtil: { setCache, getCache },
			mailUtil,
		} = dependencies;
		const { userEmail, userNickname } = info;

		/** Check request count */
		const cacheData = await getCache(userEmail);
		const requestCount = getRequestCount(cacheData);

		/** If many requests in a short period of time, restrict mail verification */
		if (!canSendEmail(requestCount)) {
			return false;
		}

		/** Get random state(Email verification, expire in 10min) and caching */
		const state = await getRandomState(requestCount);
		await setCache(userEmail, state, 600);

		/** Mail Send(Include random state) */
		await sendMail(mailUtil, { state, userEmail, userNickname });

		return true;
	};
