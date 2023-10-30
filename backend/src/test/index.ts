/* eslint-disable import/no-extraneous-dependencies */
import sinon from 'sinon';
import { exec } from 'child_process';
import { promisify } from 'util';

import { sync, closeConnection } from '@/loader/mysql';

const execsync = promisify(exec);

export const mochaGlobalSetup = async () => {
	const down = await execsync('npx sequelize-cli db:seed:undo:all --env test');
	console.log(down.stdout);

	await sync();

	const up = await execsync('npx sequelize-cli db:seed:all --env test');
	console.log(up.stdout);
};

export const mochaGlobalTeardown = async () => {
	await closeConnection();
};

export const mochaHooks = {
	afterEach() {
		sinon.restore();
	},
};

export default {};
