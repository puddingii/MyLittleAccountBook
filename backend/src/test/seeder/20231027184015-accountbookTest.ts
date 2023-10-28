import { QueryInterface, Op } from 'sequelize';
import dayjs from 'dayjs';

export default {
	async migrate(queryInterface: QueryInterface) {
		const curDay = dayjs();
		const list = Array.from({ length: 10000 }, (_, idx) => {
			const date = curDay.subtract(idx, 'd').toDate();
			return {
				id: idx + 1,
				createdAt: date,
				title: `title${idx}`,
				updatedAt: date,
				content: `content${idx}`,
			};
		});

		await queryInterface.bulkInsert('accountbooks', list);
	},

	async revert(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('accountbooks', { id: { [Op.gte]: 0 } });
	},
};
