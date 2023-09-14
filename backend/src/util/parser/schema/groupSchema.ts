import * as zod from 'zod';

const getList = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
	}),
});

const addGroupUser = zod.object({
	body: zod.object({
		email: zod.string(),
		type: zod.enum(['observer', 'writer', 'manager']),
		accountBookId: zod.number(),
	}),
});

const updateGroupUser = zod.object({
	body: zod.object({
		email: zod.string(),
		type: zod.enum(['observer', 'writer', 'manager']),
		accountBookId: zod.number(),
	}),
});

export type TGetListQuery = zod.infer<typeof getList>;
export type TAddGroupUserQuery = zod.infer<typeof addGroupUser>;
export type TUpdateGroupUserQuery = zod.infer<typeof updateGroupUser>;

export default { getList, addGroupUser, updateGroupUser };
