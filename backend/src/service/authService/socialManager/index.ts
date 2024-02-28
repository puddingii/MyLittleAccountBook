import GoogleManager from './google';
import NaverManager from './naver';

import { ISocialManager } from '@/interface/auth';

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
