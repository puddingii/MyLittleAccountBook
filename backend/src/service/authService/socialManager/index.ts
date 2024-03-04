import GoogleManager from './google';
import NaverManager from './naver';

import { ISocialManager, TSocialTokenInfo } from '@/interface/auth';

const SOCIAL_MANAGER_FACTORY = {
	Google: new GoogleManager(),
	Naver: new NaverManager(),
};

export const getSocialManager = (type: 'Google' | 'Naver') => {
	return SOCIAL_MANAGER_FACTORY[type];
};

export const getUserInfo =
	(manager: ISocialManager) => async (info: { code: string; state?: string }) => {
		const token = await manager.getToken(info.code, info.state);
		const userInfo = await manager.getUserInfo(token);

		return userInfo;
	};

export const getRedirectUrl = (manager: ISocialManager) => (state: string) => {
	return manager.getRedirectUrl(state);
};

export default abstract class SocialManager<CL, CO> implements ISocialManager {
	protected client;
	protected config;
	constructor(init: { client: CL; config: CO }) {
		this.client = init.client;
		this.config = init.config;
	}

	abstract getRedirectUrl(state: string): string;
	abstract getToken(code: string, state?: string | undefined): Promise<TSocialTokenInfo>;
	abstract getUserInfo(
		token: TSocialTokenInfo,
	): Promise<{ nickname: string; email: string }>;
}
