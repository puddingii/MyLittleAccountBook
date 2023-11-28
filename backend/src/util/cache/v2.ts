import { curry, map, pipe, toArray } from '@fxts/core';

import redisClient from '@/loader/redis';

const cacheKeyInfo = {
	REFRESH_TOKEN: 'refreshToken',
	SOCIAL_LOGIN_STATE: 'socialLoginState',
	REC_CATEGORY: 'recursiveCategory',
};
type TCacheType = keyof typeof cacheKeyInfo;

const getCacheKey = (type: TCacheType, key: string) => `${cacheKeyInfo[type]}-${key}`;

/** 캐싱처리되어 있는 데이터 불러오기 */
const getCache = curry(async (type: TCacheType, key: string) => {
	const value = await redisClient.get(getCacheKey(type, key));

	return value;
});

export const getRefreshTokenCache = getCache('REFRESH_TOKEN');
export const getSocialLoginStateCache = getCache('SOCIAL_LOGIN_STATE');
export const getRecursiveCategoryCache = getCache('REC_CATEGORY');

/**
 * @param time Default 값은 600초
 */
const setCache = curry(
	async (type: TCacheType, key: string, value: number | string | Buffer, time = 600) => {
		await redisClient.set(getCacheKey(type, key), value, { EX: time });
	},
);

export const setRefreshTokenCache = setCache('REFRESH_TOKEN');
export const setSocialLoginStateCache = setCache('SOCIAL_LOGIN_STATE');
export const setRecursiveCategoryCache = setCache('REC_CATEGORY');

/** 캐시 삭제 */
const deleteCache = curry(async (type: TCacheType, key: string | Array<string>) => {
	const keyInfo =
		typeof key === 'string'
			? getCacheKey(type, key)
			: pipe(
					key,
					map(info => getCacheKey(type, info)),
					toArray,
			  );

	const result = await redisClient.del(keyInfo);
	return result;
});

export const deleteRefreshTokenCache = deleteCache('REFRESH_TOKEN');
export const deleteSocialLoginStateCache = deleteCache('SOCIAL_LOGIN_STATE');
export const deleteRecursiveCategoryCache = deleteCache('REC_CATEGORY');
