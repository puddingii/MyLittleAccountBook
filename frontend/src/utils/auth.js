import { setAxiosAuthorization } from './axios';
import { deleteCookie, setCookie } from './cookie';

export const setToken = token => {
	if (token !== '') {
		setAxiosAuthorization(token);
		setCookie('token', token);
	}
};

export const deleteExpiredAuthUtil = error => {
	if (
		(typeof error === 'boolean' && error) ||
		(typeof error !== 'boolean' && error?.response?.status === 404)
	) {
		setAxiosAuthorization();
		deleteCookie('token');
		window.location.href = '/login';
	}
};
