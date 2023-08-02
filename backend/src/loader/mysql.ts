import { Sequelize } from 'sequelize';

import { logger } from '@/util';
import secret from '@/config/secret';
import { checkIsCustomError, convertErrorToCustomError } from '@/util/error';

const sequelize = new Sequelize(
	secret.mysqlDatabaseName,
	secret.mysqlUsername,
	secret.mysqlPw,
	{
		host: secret.mysqlHost,
		dialect: 'mysql',
		logging: msg => {
			logger.info(msg, ['Mysql']);
		},
	},
);

export const syncConnection = async () => {
	try {
		const syncOptions = secret.nodeEnv === 'production' ? {} : { force: true };

		await import(`../model`);
		await sequelize.authenticate();
		await sequelize.sync(syncOptions);
		logger.info('Connection has been established successfully.', ['Mysql']);
	} catch (error) {
		if (checkIsCustomError(error)) {
			error.addTrace('Mysql');
			throw error;
		}

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
		if (checkIsCustomError(error)) {
			error.addTrace('Mysql');
			throw error;
		}

		const customError = convertErrorToCustomError(error, { trace: 'Mysql' });
		throw customError;
	}
};

export default sequelize;
