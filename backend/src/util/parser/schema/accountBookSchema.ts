import * as zod from 'zod';

const getCategory = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
	}),
});

export default { getCategory };
