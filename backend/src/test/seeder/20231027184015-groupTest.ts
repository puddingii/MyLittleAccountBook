import { QueryInterface } from 'sequelize';

export default {
	async migrate(queryInterface: QueryInterface) {
		const date = new Date();
		const list = Array.from({ length: 5000 }, (_, idx) => {
			return {
				id: idx + 1,
				accountBookId: idx + 1,
				userEmail: `test${idx}@naver.com`,
				userType: 'owner',
				accessHistory: date,
			};
		});
		await queryInterface.bulkInsert('groups', list);
	},

	async revert(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('groups', {});
	},
};
