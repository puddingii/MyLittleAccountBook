import { getUrl as getGoogleUrl } from './google';
import { getUrl as getNaverUrl } from './naver';

export const SOCIAL_URL_MANAGER = {
	Google: getGoogleUrl,
	Naver: getNaverUrl,
};
