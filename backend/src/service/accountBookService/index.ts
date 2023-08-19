import { getCategoryList } from '@/repository/categoryRepository';
import { convertErrorToCustomError } from '@/util/error';

export const getCategory = async (
	accountBookId: number,
	depth = { start: 2, end: 2 },
) => {
	try {
		const categoryList = await getCategoryList(accountBookId, depth);

		const filteredList = categoryList.map(category => {
			const parentName = category.categoryNamePath.split(' > ')[0];
			return {
				parentId: category.parentId,
				childId: category.id,
				parentName,
				categoryNamePath: category.categoryNamePath,
				categoryIdPath: category.categoryIdPath,
			};
		});

		return filteredList;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Service',
			code: 400,
		});
		throw customError;
	}
};
