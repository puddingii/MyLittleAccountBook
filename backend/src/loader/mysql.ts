import { Sequelize } from 'sequelize';

import { logger } from '@/util';
import secret from '@/config/secret';
import { convertErrorToCustomError } from '@/util/error';
import { createEmailUser } from '@/repository/userRepository';

const { databaseName, host, pw, username } = secret.mysql;

const sequelize = new Sequelize(databaseName, username, pw, {
	host: host,
	dialect: 'mysql',
	logging: msg => {
		logger.info(msg, ['Mysql']);
	},
});

export const sync = async () => {
	try {
		const syncOptions = secret.nodeEnv === 'production' ? {} : { force: true };

		await import(`../model`);
		await sequelize.authenticate();
		await sequelize.sync(syncOptions);
		logger.info('Connection has been established successfully.', ['Mysql']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Mysql',
		});
		throw customError;
	}
};

export const createTestAccount = async () => {
	try {
		await createEmailUser({
			email: 'test@naver.com',
			password: 'test123!@TEST',
			nickname: 'testUser',
		});
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Mysql',
		});
		throw customError;
	}
};

export const closeConnection = async () => {
	try {
		await sequelize.close();
		logger.info('Connection has been closed successfully.', ['Mysql']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Mysql' });
		throw customError;
	}
};

export default sequelize;
