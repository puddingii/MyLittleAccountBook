/** Library */
import { Transaction } from 'sequelize';

/** Interface */
import { TCategoryMap, TPost } from '@/interface/api/response/manageCategoryResponse';
import {
	TAddCategory,
	TDeleteCategory,
	TGetCategoryList,
	TUpdateCategoryInfo,
} from '@/interface/service/manageCategoryService';

export const getCategoryList =
	(dependencies: TGetCategoryList['dependency']) =>
	async (info: TGetCategoryList['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findCategoryList },
		} = dependencies;

		try {
			const list = await findCategoryList(info);
			const filteredMap: Map<number, TCategoryMap> = new Map();
			const isParentIdExisted = (parentId?: number): parentId is number =>
				typeof parentId === 'number';

			list.forEach(info => {
				const { id, parentId, name } = info;
				const mapId = isParentIdExisted(parentId) ? parentId : id;
				const savedInfo = filteredMap.get(mapId);

				if (!isParentIdExisted(parentId) && !savedInfo) {
					filteredMap.set(id, { id, parentId, name, childList: [] });
				}
				if (isParentIdExisted(parentId) && savedInfo) {
					const childList = [...savedInfo.childList];
					childList.push({ id, parentId, name });
					filteredMap.set(parentId, { ...savedInfo, childList });
				}
			});

			return [...filteredMap.values()];
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

const addMainCategory = async (
	info: { accountBookId: number; name: string },
	dependencies: {
		createCategory: TAddCategory['dependency']['repository']['createCategory'];
		transaction: Transaction;
	},
) => {
	const { createCategory, transaction } = dependencies;
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
	dependencies: {
		createCategory: TAddCategory['dependency']['repository']['createCategory'];
		findCategory: TAddCategory['dependency']['repository']['findCategory'];
		transaction: Transaction;
	},
) => {
	const { createCategory, findCategory, transaction } = dependencies;
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

const isParentCategory = (info: {
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

export const addCategory =
	(dependencies: TAddCategory['dependency']) => async (info: TAddCategory['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			cacheUtil: { deleteCache },
			sequelize,
			service: { checkAdminGroupUser },
			repository: { createCategory, findCategory },
		} = dependencies;

		try {
			const { myEmail, ...categoryInfo } = info;

			await checkAdminGroupUser({
				userEmail: myEmail,
				accountBookId: info.accountBookId,
			});
			const transaction = await sequelize.transaction({ autocommit: false });
			try {
				let result: TPost['data'];

				if (isParentCategory(categoryInfo)) {
					result = await addSubCategory(categoryInfo, {
						transaction,
						createCategory,
						findCategory,
					});
				} else {
					result = await addMainCategory(categoryInfo, { transaction, createCategory });
				}

				await transaction.commit();

				await deleteCache(`${info.accountBookId}`);
				return result;
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const updateCategoryInfo =
	(dependencies: TUpdateCategoryInfo['dependency']) =>
	async (info: TUpdateCategoryInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			cacheUtil: { deleteCache },
			service: { checkAdminGroupUser },
			repository: { updateCategory },
		} = dependencies;

		try {
			const { myEmail, ...categoryInfo } = info;
			await checkAdminGroupUser({
				userEmail: myEmail,
				accountBookId: info.accountBookId,
			});

			const countList = await updateCategory(categoryInfo);
			if (countList[0] < 1) {
				throw new Error('정상적으로 수정되지 않았습니다.');
			}
			await deleteCache(`${info.accountBookId}`);
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

const checkChildConditionToDelete = async (
	info: { parentId: number; accountBookId: number },
	dependencies: {
		findCategoryList: TDeleteCategory['dependency']['repository']['findCategoryList'];
		transaction?: Transaction;
	},
) => {
	const { accountBookId, parentId } = info;
	const { findCategoryList } = dependencies;

	const childList = await findCategoryList({ accountBookId, parentId });
	// 부모 카테고리는 자식 카테고리들을 먼저 삭제해야 삭제 가능
	if (childList.length > 0) {
		throw new Error('서브 카테고리를 모두 제거 후, 메인 카테고리를 제거할 수 있습니다.');
	}
};

const checkParentConditionToDelete = async (
	info: { categoryId: number },
	dependencies: {
		findGAB: TDeleteCategory['dependency']['repository']['findGAB'];
		findFGAB: TDeleteCategory['dependency']['repository']['findFGAB'];
	},
) => {
	const { categoryId } = info;
	const { findFGAB, findGAB } = dependencies;

	const fgab = await findFGAB({ categoryId });
	if (fgab) {
		throw new Error('해당 카테고리를 사용하는 기록이 있습니다.');
	}

	const gab = await findGAB({ categoryId });
	if (gab) {
		throw new Error('해당 카테고리를 사용하는 기록이 있습니다.');
	}
};

export const deleteCategory =
	(dependencies: TDeleteCategory['dependency']) =>
	async (info: TDeleteCategory['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			cacheUtil: { deleteCache },
			service: { checkAdminGroupUser },
			repository: { findCategory, findCategoryList, findFGAB, findGAB, deleteCategory },
		} = dependencies;

		try {
			const { accountBookId, id, myEmail } = info;
			await checkAdminGroupUser({ userEmail: myEmail, accountBookId });

			const condition = { accountBookId, id };
			const category = await findCategory(condition);
			if (!category) {
				throw new Error('해당 카테고리를 찾을 수 없습니다.');
			}

			if (isParentCategory(category)) {
				await checkParentConditionToDelete(
					{ categoryId: category.id },
					{ findFGAB, findGAB },
				);
			} else {
				await checkChildConditionToDelete(
					{ accountBookId, parentId: id },
					{ findCategoryList },
				);
			}

			const count = await deleteCategory(condition);
			if (count) {
				await deleteCache(`${accountBookId}`);
			}

			return count;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
