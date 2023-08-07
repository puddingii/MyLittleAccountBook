import jwt from 'jsonwebtoken';

import secret from '@/config/secret';

const {
	express: { jwtSecureKey, jwtAccessTokenTime, jwtRefreshTokenTime },
} = secret;

export const createRefreshToken = () => {
	const encodedToken = jwt.sign({}, jwtSecureKey, {
		expiresIn: `${jwtRefreshTokenTime}s`,
	});
	return encodedToken;
};

export const createAccessToken = (data: object) => {
	const encodedToken = jwt.sign(data, jwtSecureKey, {
		expiresIn: `${jwtAccessTokenTime}s`,
	});
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

export const decodeToken = <T>(token: string) => {
	return jwt.decode(token, { json: true }) as T;
};

export const refreshAccessToken = (
	options: {
		data: { nickname: string; email: string };
	},
	refreshToken = '',
	accessToken = '',
) => {
	const { data: accessData } = options;
	const isExpiredRefreshToken = isExpiredToken(refreshToken);
	const isExpiredAccessToken = isExpiredToken(accessToken);
	/** Refresh token X, Access token X */
	/** Refresh token X, Access token O */
	if ((isExpiredAccessToken && isExpiredRefreshToken) || isExpiredRefreshToken) {
		throw new Error('로그인이 필요합니다.');
	}

	/** Refresh token O, Access token X */
	if (isExpiredAccessToken) {
		const newAccessToken = createAccessToken(accessData);

		return newAccessToken;
	}

	return accessToken;
};
