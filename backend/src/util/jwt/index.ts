import jwt from 'jsonwebtoken';

import secret from '@/config/secret';
import { TDecodedAccessTokenInfo } from '@/interface/auth';
import { deleteCache, getCache } from '../cache';

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
	return jwt.decode(token, { json: true }) as T | null;
};

export const verifyAll = async ({
	accessToken,
	refreshToken,
}: {
	refreshToken: string;
	accessToken: string;
}) => {
	const isExpiredRefreshToken = isExpiredToken(refreshToken);
	const isExpiredAccessToken = isExpiredToken(accessToken);
	/** Refresh token X, Access token X */
	if (isExpiredAccessToken && isExpiredRefreshToken) {
		throw new Error('로그인이 필요합니다.');
	}

	/** Access Token is '' */
	if (!accessToken) {
		throw new Error('로그인이 필요합니다.');
	}

	const decodedData = decodeToken<TDecodedAccessTokenInfo>(accessToken);
	if (!decodedData) {
		throw new Error('로그인이 필요합니다.');
	}

	/** Refresh token X, Access token O */
	if (isExpiredRefreshToken) {
		await deleteCache(decodedData.email);
		throw new Error('로그인이 필요합니다.');
	}

	/** Refresh token O, Access token X */
	const cachedRefreshToken = await getCache(decodedData.email);
	if (cachedRefreshToken !== refreshToken) {
		await deleteCache(decodedData.email);
		throw new Error('로그인이 필요합니다.');
	}

	return decodedData;
};
