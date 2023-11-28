import dayjs from 'dayjs';
import { QueryInterface, Op } from 'sequelize';

export default {
	async migrate(queryInterface: QueryInterface) {
		const date = dayjs().toDate();
		const list = Array.from({ length: 2500 }, (_, idx) => {
			return {
				id: idx + 1,
				type: idx % 2 === 0 ? 'Google' : 'Naver',
				createdAt: date,
				userEmail: `test${idx * 2}@naver.com`,
			};
		});
		await queryInterface.bulkInsert('oauthusers', list);
	},

	async revert(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('oauthusers', { id: { [Op.gte]: 0 } });
	},
};
