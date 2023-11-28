import redisClient from '@/loader/redis';

/** 캐시값 불러오기 */
export const getCache = async (key: string) => {
	const value = await redisClient.get(key);

	return value;
};

/**
 * @param time Default 값은 600초
 */
export const setCache = async (
	key: string,
	value: number | string | Buffer,
	time = 600,
) => {
	await redisClient.set(key, value, { EX: time });
};

/** 캐시 삭제 */
export const deleteCache = async (key: string | Array<string>) => {
	const result = await redisClient.del(key);

	return result;
};
