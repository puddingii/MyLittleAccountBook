import { deleteAxiosHeaders, setAxiosToken } from './axios';
import { deleteCookie, setCookie } from './cookie';

export const isExpiredToken = error => {
	return error && error?.response?.status === 401;
};

/**
 * @param {Partial<{ accessToken: string; refreshToken: string }>} tokenInfo
 */
export const setToken = tokenInfo => {
	const { accessToken, refreshToken } = tokenInfo;
	const headerInfo = {};

	if (accessToken) {
		headerInfo['Authorization'] = accessToken;
	}
	if (refreshToken) {
		headerInfo['refresh'] = refreshToken;
		setCookie('token', refreshToken);
	}

	setAxiosToken(headerInfo);
};

/**
 * @param {'Authorization' | 'refresh'} name
 */
export const deleteToken = name => {
	deleteAxiosHeaders(name);
	if (name === 'refresh') {
		deleteCookie('token');
	}
};
