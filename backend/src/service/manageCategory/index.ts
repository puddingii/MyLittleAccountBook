/** Library */
import { Transaction } from 'sequelize';

/** Repository */
import {
	createCategory,
	findCategory,
	findCategoryList,
} from '@/repository/categoryRepository';

/** Sub Service */

/** Interface */
import { TCategoryMap } from '@/interface/api/response/manageCategoryResponse';

/** Etc */
import { convertErrorToCustomError } from '@/util/error';
import sequelize from '@/loader/mysql';

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

const addMainCategory = async (
	info: { accountBookId: number; name: string },
	transaction: Transaction,
) => {
	const newMainCategory = await createCategory(info, transaction);
	const newSubCategory = await createCategory(
		{
			accountBookId: info.accountBookId,
			name: '기타',
			parentId: newMainCategory.id,
		},
		transaction,
	);

	return {
		id: newMainCategory.id,
		childList: [
			{
				id: newSubCategory.id,
				name: newSubCategory.name,
				parentId: newSubCategory.parentId,
			},
		],
	};
};

const addSubCategory = async (
	info: { accountBookId: number; name: string; parentId: number },
	transaction: Transaction,
) => {
	const { parentId, accountBookId } = info;
	const mainCategory = await findCategory(
		{ id: parentId, accountBookId },
		{ transaction, lock: true, skipLocked: true },
	);
	if (!mainCategory) {
		throw new Error('parentId에 해당하는 상위 노드가 존재하지 않습니다.');
	}
	const newCategory = await createCategory(info);

	return { id: newCategory.id };
};

const isParentIdNumber = (info: {
	accountBookId: number;
	name: string;
	parentId?: number;
}): info is {
	accountBookId: number;
	name: string;
	parentId: number;
} => {
	return typeof info.parentId === 'number';
};

export const addCategory = async (info: {
	accountBookId: number;
	name: string;
	parentId?: number;
}) => {
	try {
		const transaction = await sequelize.transaction({ autocommit: false });
		try {
			let result: {
				id: number;
				childList?: Array<{ id: number; parentId?: number; name: string }>;
			};

			if (isParentIdNumber(info)) {
				result = await addSubCategory(info, transaction);
			} else {
				result = await addMainCategory(info, transaction);
			}

			await transaction.commit();

			return result;
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
