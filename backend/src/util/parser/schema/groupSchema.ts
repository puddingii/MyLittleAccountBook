import * as zod from 'zod';

const getList = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
	}),
});

const addGroupUser = zod.object({
	body: zod.object({
		userEmail: zod.string(),
		userType: zod.enum(['observer', 'writer', 'manager']),
		accountBookId: zod.number(),
		accessHistory: zod.string().optional(),
	}),
});

const updateGroupUser = zod.object({
	body: zod.object({
		userEmail: zod.string(),
		userType: zod.enum(['observer', 'writer', 'manager']),
		accountBookId: zod.number(),
		accessHistory: zod.string().optional(),
	}),
});

const deleteGroupUser = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
		id: zod.string(),
	}),
});

const validation = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
	}),
});

export type TGetListQuery = zod.infer<typeof getList>;
export type TAddGroupUserQuery = zod.infer<typeof addGroupUser>;
export type TUpdateGroupUserQuery = zod.infer<typeof updateGroupUser>;
export type TDeleteGroupUserQuery = zod.infer<typeof deleteGroupUser>;
export type TValidationQuery = zod.infer<typeof validation>;

export default { getList, addGroupUser, updateGroupUser, deleteGroupUser, validation };
