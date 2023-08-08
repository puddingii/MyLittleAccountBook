import { setAxiosAuthorization } from './axios';
import { deleteCookie, setCookie } from './cookie';

export const isExpiredToken = error => {
	return error && error?.response?.status === 401;
};

export const setToken = token => {
	if (token) {
		setAxiosAuthorization(token);
		setCookie('token', token);
	} else {
		setAxiosAuthorization();
		deleteCookie('token');
	}
};
