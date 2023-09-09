import * as zod from 'zod';

const getUser = zod.object({
	query: zod.object({
		email: zod.string().optional(),
		nickname: zod.string().optional(),
	}),
});

export type TGetUserQuery = zod.infer<typeof getUser>;

export default { getUser };
