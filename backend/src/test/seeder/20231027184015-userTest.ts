import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

export default {
	async migrate(queryInterface: QueryInterface) {
		const hashedValue = await bcrypt.hash('password', 1);
		const list = Array.from({ length: 5000 }, (_, idx) => {
			const password = idx % 2 === 0 ? {} : { password: hashedValue };

			return {
				email: `test${idx}@naver.com`,
				nickname: `test${idx}`,
				...password,
			};
		});
		await queryInterface.bulkInsert('users', list);
	},

	async revert(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('users', {});
	},
};
