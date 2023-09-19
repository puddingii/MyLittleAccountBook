import * as zod from 'zod';

const getCategory = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
	}),
});

export type TGetCategoryQuery = zod.infer<typeof getCategory>;

export default {
	getCategory,
};
