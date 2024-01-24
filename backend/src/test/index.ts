/* eslint-disable import/no-extraneous-dependencies */
import sinon from 'sinon';
import { exec } from 'child_process';
import { promisify } from 'util';

import { sequelize } from './commonDependency';
import { sync, closeConnection, associateModel, getModelList } from '@/loader/mysql';

const execsync = promisify(exec);

const isProductionMode = process.env.NODE_ENV === 'production';

const initProductionMySQL = async () => {
	const modelInfo = await getModelList();
	associateModel(modelInfo);
};

const initDevelopmentMySQL = async () => {
	const down = await execsync('npx sequelize-cli db:seed:undo:all --env test');
	console.log(down.stdout);

	await sync(sequelize);

	const up = await execsync('npx sequelize-cli db:seed:all --env test');
	console.log(up.stdout);
};

export const mochaGlobalSetup = async () => {
	const initializer = isProductionMode ? initProductionMySQL : initDevelopmentMySQL;
	await initializer();
};

export const mochaGlobalTeardown = async () => {
	if (isProductionMode) {
		await closeConnection(sequelize);
	}
};

export const mochaHooks = {
	afterEach() {
		sinon.restore();
	},
};

export default {};
