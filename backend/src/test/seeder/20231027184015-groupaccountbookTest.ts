import dayjs from 'dayjs';
import { QueryInterface } from 'sequelize';

export default {
	async migrate(queryInterface: QueryInterface) {
		const date = dayjs().toDate();
		const list = Array.from({ length: 14000 }, (_, idx) => {
			const groupId = Math.round(idx / 3) + 1;
			return {
				id: idx + 1,
				categoryId: groupId * 22 - (idx % 3) * 2 - 2,
				groupId,
				value: 10000,
				content: `내용${idx}`,
				type: idx % 2 === 0 ? 'spending' : 'income',
				spendingAndIncomeDate: date,
				createdAt: date,
			};
		});
		await queryInterface.bulkInsert('groupaccountbooks', list);
	},

	async revert(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('groupaccountbooks', {});
	},
};
