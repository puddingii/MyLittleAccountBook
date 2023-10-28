import { QueryInterface, Op } from 'sequelize';

import defaultCategory from '../../json/defaultCategory.json';

type TCategoryInfo = Array<{
	accountBookId: number;
	name: string;
	id: number;
	parentId?: number;
}>;

export default {
	async migrate(queryInterface: QueryInterface) {
		const categoryList = [] as TCategoryInfo;
		for (let accountBookId = 1; accountBookId <= 10000; accountBookId++) {
			const categoryLength = categoryList.length;
			const list = defaultCategory.rootCategory.reduce((acc, category, idx) => {
				const parentInfo = {
					accountBookId,
					name: category.name,
					id: categoryLength + idx * 2 + 1,
				};
				const childInfo = {
					accountBookId,
					name: '기타',
					parentId: categoryLength + idx * 2 + 1,
					id: categoryLength + idx * 2 + 2,
				};
				acc.push(parentInfo, childInfo);

				return acc;
			}, [] as TCategoryInfo);

			categoryList.push(...list);
		}

		await queryInterface.bulkInsert('categorys', categoryList);
	},

	async revert(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('categorys', { id: { [Op.gte]: 0 } });
	},
};
