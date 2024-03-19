import { nanoid } from 'nanoid/async';

export const getRandomString = async (length: number, additionalStr?: string) => {
	const randomString = await nanoid(length);

	return `${randomString}${additionalStr ?? ''}`;
};

export const isString = (str: unknown): str is string => typeof str === 'string';
