import axios from 'axios';

/**
 * @param {{[key: string]: string}} tokenInfo
 */
export const setAxiosToken = tokenInfo => {
	Object.keys(tokenInfo).forEach(key => {
		axios.defaults.headers.common[key] = tokenInfo[key];
	});
};

/**
 * @param {'Authorization' | 'refresh'} name Access Token 및 Refresh Token
 */
export const deleteAxiosHeaders = name => {
	if (axios.defaults.headers.common[name]) {
		delete axios.defaults.headers.common[name];
	}
};
