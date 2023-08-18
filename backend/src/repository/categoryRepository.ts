/** ETC.. */
import { convertErrorToCustomError } from '@/util/error';
import CategoryModel from '@/model/category';

import sequelize from '@/loader/mysql';

/** 유저 찾기(소셜 정보 추가) */
export const getCategoryList = async () => {
	try {
		const result = await sequelize.query(
			`WITH RECURSIVE category_list AS (
				SELECT *, CAST(id AS CHAR(100)) AS category_path, 1 as depth
				FROM categories
				WHERE parentId IS NULL
				UNION ALL
				SELECT c.*, CONCAT(c.id, ' > ', cl.category_path) AS category_path, depth+1
				FROM category_list cl
				INNER JOIN categories c
				ON c.parentId=cl.id
				)
			SELECT * FROM category_list ORDER BY depth ASC;`,
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
