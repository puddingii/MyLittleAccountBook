/* eslint-disable import/no-extraneous-dependencies */
import sinon from 'sinon';
import { sync, closeConnection } from '@/loader/mysql';

export const mochaGlobalSetup = async () => {
	await sync();
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
