import { nanoid } from 'nanoid/async';

export const getRandomString = async (length: number, additionalStr?: string) => {
	const randomString = await nanoid(length);

	return `${randomString}${additionalStr}`;
};
