import * as zod from 'zod';

const getUser = zod.object({
	query: zod.object({
		email: zod.string().optional(),
		nickname: zod.string().optional(),
	}),
});

const patchUser = zod.object({
	body: zod.object({
		nickname: zod.string(),
	}),
	headers: zod.object({
		refresh: zod.string({ required_error: 'Refresh token is expired.' }),
		authorization: zod
			.string({ required_error: 'Access token is expired.' })
			.refine(data => data.split(' ')[0] === 'Bearer', 'Token type error'),
	}),
});

export type TGetUserQuery = zod.infer<typeof getUser>;
export type TPatchUserQuery = zod.infer<typeof patchUser>;

export default { getUser, patchUser };
