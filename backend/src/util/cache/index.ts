import redisClient from '@/loader/redis';

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

export const deleteCache = async (key: string | Array<string>) => {
	await redisClient.del(key);
};
