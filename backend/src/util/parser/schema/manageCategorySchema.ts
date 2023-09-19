import * as zod from 'zod';

const getCategory = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
	}),
});

const postCategory = zod.object({
	body: zod.object({
		accountBookId: zod.number(),
		name: zod.string(),
		parentId: zod.number().optional(),
	}),
});

export type TGetCategoryQuery = zod.infer<typeof getCategory>;
export type TPostCategoryQuery = zod.infer<typeof postCategory>;

export default {
	getCategory,
	postCategory,
};
