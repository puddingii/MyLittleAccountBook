import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

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
		const modelFolder = fs.readdirSync(path.resolve(__dirname, '../model'));
		const modelList = modelFolder.filter(
			file => file.endsWith('.js') || file.endsWith('.ts'),
		);
		const syncOptions = secret.nodeEnv === 'production' ? {} : { alter: true };

		for await (const file of modelList) {
			await import(`../model/${file}`);
		}
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
