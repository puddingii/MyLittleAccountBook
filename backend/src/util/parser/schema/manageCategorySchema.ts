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

const patchCategory = zod.object({
	body: zod.object({
		accountBookId: zod.number(),
		name: zod.string(),
		id: zod.number(),
	}),
});

const deleteCategory = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
		id: zod.string(),
	}),
});

export type TGetCategoryQuery = zod.infer<typeof getCategory>;
export type TPostCategoryQuery = zod.infer<typeof postCategory>;
export type TPatchCategoryQuery = zod.infer<typeof patchCategory>;
export type TDeleteCategoryQuery = zod.infer<typeof deleteCategory>;

export default {
	getCategory,
	postCategory,
	patchCategory,
	deleteCategory,
};
