import jwt, { SignOptions } from 'jsonwebtoken';

import secret from '@/config/secret';

const {
	express: { jwtSecureKey },
} = secret;

export const createRefreshToken = (options?: SignOptions) => {
	const encodedToken = jwt.sign({}, jwtSecureKey, options || { expiresIn: '14d' });
	return encodedToken;
};

export const createAccessToken = (data: object, options?: SignOptions) => {
	const encodedToken = jwt.sign(data, jwtSecureKey, options || { expiresIn: '1h' });
	return encodedToken;
};

export const isExpiredToken = (token?: string): token is undefined => {
	try {
		if (!token) {
			return true;
		}
		jwt.verify(token, jwtSecureKey);

		return false;
	} catch (error) {
		return true;
	}
};

export const decodeToken = (token: string) => {
	if (isExpiredToken(token)) {
		throw new Error('만료된 토큰입니다.');
	}
	return jwt.decode(token);
};

export const refreshAccessToken = (
	options: {
		data: { nickname: string; email: string };
		options?: SignOptions;
	},
	refreshToken = '',
	accessToken = '',
) => {
	const { data: accessData, options: accessOptions } = options;
	const isExpiredRefreshToken = isExpiredToken(refreshToken);
	const isExpiredAccessToken = isExpiredToken(accessToken);
	/** Refresh token X, Access token X */
	/** Refresh token X, Access token O */
	if ((isExpiredAccessToken && isExpiredRefreshToken) || isExpiredRefreshToken) {
		throw new Error('로그인이 필요합니다.');
	}

	/** Refresh token O, Access token X */
	if (isExpiredAccessToken) {
		const newAccessToken = createAccessToken(accessData, accessOptions);

		return newAccessToken;
	}

	return accessToken;
};
