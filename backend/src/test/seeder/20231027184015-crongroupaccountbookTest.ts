import { QueryInterface } from 'sequelize';

export default {
	async migrate(queryInterface: QueryInterface) {
		const date = new Date();
		const cycleType = ['d', 'sd', 'w', 'm', 'y'];
		const list = Array.from({ length: 14000 }, (_, idx) => {
			const groupId = Math.round(idx / 3) + 1;
			return {
				id: idx + 1,
				categoryId: groupId * 22 - (idx % 3) * 2 - 2,
				groupId,
				value: 10000,
				content: `내용${idx}`,
				type: idx % 2 === 0 ? 'spending' : 'income',
				cycleTime: 16,
				cycleType: cycleType[idx % 5],
				needToUpdateDate: date,
				isActivated: true,
				createdAt: date,
			};
		});
		await queryInterface.bulkInsert('crongroupaccountbooks', list);
	},

	async revert(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete('crongroupaccountbooks', {});
	},
};
