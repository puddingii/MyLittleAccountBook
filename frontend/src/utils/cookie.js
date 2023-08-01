import { Cookies } from 'react-cookie';

const cookie = new Cookies();

/**
 * 쿠키 설정
 * @param {string} name
 * @param {string | object} value
 */
export const setCookie = (name, value) => {
	return cookie.set(name, value);
};

/**
 * 쿠키 name 값에 해당하는 데이터 가져오기
 * @param {string} name
 */
export const getCookie = name => {
	return cookie.get(name);
};

/**
 * 쿠키 name 값에 해당하는 데이터 삭제
 * @param {string} name
 */
export const deleteCookie = name => {
	return cookie.remove(name);
};
