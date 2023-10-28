import { QueryInterface } from 'sequelize';

import accountBookSeeder from '../test/seeder/20231027184015-accountbookTest';
import categorySeeder from '../test/seeder/20231027184015-categoryTest';
import userSeeder from '../test/seeder/20231027184015-userTest';
import oauthuserSeeder from '../test/seeder/20231027184015-oauthuserTest';
import groupSeeder from '../test/seeder/20231027184015-groupTest';
import groupaccountbookSeeder from '../test/seeder/20231027184015-groupaccountbookTest';
import crongroupaccountbookSeeder from '../test/seeder/20231027184015-crongroupaccountbookTest';

export default {
	async up(queryInterface: QueryInterface) {
		await accountBookSeeder.migrate(queryInterface);
		await categorySeeder.migrate(queryInterface);
		await userSeeder.migrate(queryInterface);
		await oauthuserSeeder.migrate(queryInterface);
		await groupSeeder.migrate(queryInterface);
		await groupaccountbookSeeder.migrate(queryInterface);
		await crongroupaccountbookSeeder.migrate(queryInterface);
	},

	async down(queryInterface: QueryInterface) {
		await accountBookSeeder.revert(queryInterface);
		await categorySeeder.revert(queryInterface);
		await userSeeder.revert(queryInterface);
		await oauthuserSeeder.revert(queryInterface);
		await groupSeeder.revert(queryInterface);
		await groupaccountbookSeeder.revert(queryInterface);
		await crongroupaccountbookSeeder.revert(queryInterface);
	},
};
