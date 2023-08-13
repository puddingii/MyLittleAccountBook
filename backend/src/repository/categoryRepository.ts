import { QueryTypes } from 'sequelize';

/** ETC.. */
import { convertErrorToCustomError } from '@/util/error';
import Category from '@/model/category';

import sequelize from '@/loader/mysql';

/** 유저 찾기(소셜 정보 추가) */
export const getCategoryList = async () => {
	try {
		const result = await sequelize.query(
			`WITH RECURSIVE category_list AS ( SELECT *, CAST(id AS CHAR(100) AS category_path, 1 as depth FROM categories WHERE parentId IS NULL UNION ALL SELECT e.*, CONCAT(e.id ' > ', cl.category_path) AS category_path, depth+1 FROM category_list cl INNER JOIN categories c ON c.parentId=cl.id) SELECT * FROM category_list ORDER BY depth ASC;`,
		);

		return result;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};

/** FIXME */
export const tcreateCategory = async (categoryInfo: {
	parentId?: number;
	name: string;
}) => {
	await Category.create(categoryInfo);
};
