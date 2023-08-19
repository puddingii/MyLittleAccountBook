import { QueryTypes } from 'sequelize';

/** ETC.. */
import { convertErrorToCustomError } from '@/util/error';
import CategoryModel from '@/model/category';
import sequelize from '@/loader/mysql';

import { TCategoryInfo } from '@/interface/model/categoryRepository';

/** 유저 찾기(소셜 정보 추가) */
export const getCategoryList = async (
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
		});
		throw customError;
	}
};

export const createCategory = async (categoryInfo: {
	parentId?: number;
	name: string;
	accountBookId: number;
}) => {
	try {
		if (!categoryInfo.parentId) {
			await CategoryModel.create(categoryInfo);
			return;
		}
		const transaction = await sequelize.transaction({ autocommit: false });
		try {
			const isExistParent = await CategoryModel.findOne({
				where: { id: categoryInfo.parentId, accountBookId: categoryInfo.accountBookId },
				lock: true,
				skipLocked: true,
			});
			if (!isExistParent) {
				throw new Error('parentId에 해당하는 상위 노드가 존재하지 않습니다.');
			}
			await CategoryModel.create(categoryInfo, { transaction });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};
