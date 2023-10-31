import { QueryTypes } from 'sequelize';

import { TCategoryInfo } from '@/interface/model/categoryRepository';
import {
	TCreateCategory,
	TCreateDefaultCategory,
	TDeleteChildCategoryList,
	TFindCategory,
	TFindCategoryList,
	TFindRecursiveCategoryList,
	TUpdateCategory,
} from '@/interface/repository/categoryRepository';

/** 유저 찾기(소셜 정보 추가) */
export const findRecursiveCategoryList =
	(dependencies: TFindRecursiveCategoryList['dependency']) =>
	async (
		accountBookId: TFindRecursiveCategoryList['param'][0],
		depth: TFindRecursiveCategoryList['param'][1],
	) => {
		const {
			sequelize,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const result = await sequelize.query<TCategoryInfo>(
				`WITH RECURSIVE category_list AS (
				SELECT *, CAST(name AS CHAR(100)) AS categoryNamePath, CAST(id AS CHAR(100)) AS categoryIdPath, 1 as depth
				FROM categorys
				WHERE parentId IS NULL AND accountBookId = ${accountBookId}
				UNION ALL
				SELECT c.*, CONCAT(cl.name, ' > ', c.name) AS categoryNamePath, CONCAT(cl.id, ' > ', c.id) AS categoryIdPath, depth+1
				FROM category_list cl
				INNER JOIN categorys c
				ON c.parentId=cl.id
				)
			SELECT * FROM category_list WHERE depth BETWEEN ${depth.start} AND ${depth.end} ORDER BY depth ASC;`,
				{ type: QueryTypes.SELECT },
			);

			return result;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

/** parentId 및 name을 기준으로 오름차순 정렬하여 가져옴. */
export const findCategoryList =
	(dependencies: TFindCategoryList['dependency']) =>
	async (info: TFindCategoryList['param']) => {
		const {
			CategoryModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const categoryList = await CategoryModel.findAll({
				where: info,
				order: [
					['parentId', 'ASC'],
					['name', 'ASC'],
				],
			});

			return categoryList;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

export const findCategory =
	(dependencies: TFindCategory['dependency']) =>
	async (info: TFindCategory['param'][0], options?: TFindCategory['param'][1]) => {
		const {
			CategoryModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const category = await CategoryModel.findOne({
				where: info,
				...options,
			});

			return category;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

export const createCategory =
	(dependencies: TCreateCategory['dependency']) =>
	async (
		categoryInfo: TCreateCategory['param'][0],
		transaction?: TCreateCategory['param'][1],
	) => {
		const {
			CategoryModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const newCategory = await CategoryModel.create(categoryInfo, { transaction });

			return newCategory;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

export const createDefaultCategory =
	(dependencies: TCreateDefaultCategory['dependency']) =>
	async (
		accountBookId: TCreateDefaultCategory['param'][0],
		transaction?: TCreateDefaultCategory['param'][1],
	) => {
		const {
			CategoryModel,
			defaultCategory,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const categoryList = defaultCategory.rootCategory.map(category => ({
				name: category.name,
				accountBookId,
			}));

			const list = await CategoryModel.bulkCreate(categoryList, {
				fields: ['name', 'accountBookId'],
				validate: true,
				transaction,
			});

			/** 메인 카테고리 각각의 기타 탭 생성 */
			const parentList = list.map(parent => ({
				name: '기타',
				parentId: parent.id,
				accountBookId,
			}));
			await CategoryModel.bulkCreate(parentList, {
				fields: ['name', 'accountBookId', 'parentId'],
				validate: true,
				transaction,
			});
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

export const updateCategory =
	(dependencies: TUpdateCategory['dependency']) =>
	async (
		info: TUpdateCategory['param'][0],
		transaction?: TUpdateCategory['param'][1],
	) => {
		const {
			CategoryModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { name, ...where } = info;
			const updatedCategory = await CategoryModel.update(
				{ name },
				{ where, transaction },
			);

			return updatedCategory;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

export const deleteChildCategoryList =
	(dependencies: TDeleteChildCategoryList['dependency']) =>
	async (
		info: TDeleteChildCategoryList['param'][0],
		transaction?: TDeleteChildCategoryList['param'][1],
	) => {
		const {
			CategoryModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const count = await CategoryModel.destroy({ where: info, transaction });

			return count;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};
