/** Library */

/** Repository */
import { findCategoryList } from '@/repository/categoryRepository';

/** Sub Service */

/** Interface */
import { TCategoryMap } from '@/interface/api/response/manageCategoryResponse';

/** Etc */
import { convertErrorToCustomError } from '@/util/error';

export const getCategoryList = async (info: { accountBookId: number }) => {
	try {
		const list = await findCategoryList(info);
		const filteredMap: Map<number, TCategoryMap> = new Map();
		list.forEach(info => {
			const { id, parentId, name } = info;
			const savedInfo = filteredMap.get(parentId || id);

			if (!parentId && !savedInfo) {
				filteredMap.set(id, { id, parentId, name, childList: [] });
			}
			if (parentId && savedInfo) {
				const childList = [...savedInfo.childList];
				childList.push({ id, parentId, name });
				filteredMap.set(parentId, { ...savedInfo, childList });
			}
		});

		return [...filteredMap.values()];
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
