import { nanoid } from 'nanoid';

export const getRandomString = (length: number, additionalStr?: string) => {
	const randomString = nanoid(length);

	return `${randomString}${additionalStr ?? ''}`;
};

export const isString = (str: unknown): str is string => typeof str === 'string';
