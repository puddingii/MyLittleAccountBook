import { QueryTypes, Transaction } from 'sequelize';

/** ETC.. */
import { convertErrorToCustomError } from '@/util/error';
import CategoryModel from '@/model/category';
import sequelize from '@/loader/mysql';
import defaultCategory from '@/json/defaultCategory.json';

import { TCategoryInfo } from '@/interface/model/categoryRepository';

/** 유저 찾기(소셜 정보 추가) */
export const findRecursiveCategoryList = async (
	accountBookId: number,
	depth: { start: number; end: number },
) => {
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
export const findCategoryList = async (info: {
	accountBookId: number;
	name?: string;
	parentId?: number;
	id?: number;
}) => {
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

export const findCategory = async (
	info: {
		accountBookId: number;
		name?: string;
		parentId?: number;
		id?: number;
	},
	options?: Partial<{ transaction: Transaction; lock: boolean; skipLocked: boolean }>,
) => {
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

export const createCategory = async (
	categoryInfo: {
		parentId?: number;
		name: string;
		accountBookId: number;
	},
	transaction?: Transaction,
) => {
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

export const createDefaultCategory = async (
	accountBookId: number,
	transaction?: Transaction,
) => {
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
