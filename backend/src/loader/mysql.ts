import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { concurrent, filter, map, pipe, toArray, toAsync } from '@fxts/core';

import { logger } from '@/util';
import secret from '@/config/secret';
import { convertErrorToCustomError } from '@/util/error';

import { TModelInfo } from '@/interface/model';

const { databaseName, host, pw, username } = secret.mysql;

const logging =
	secret.nodeEnv === 'test'
		? false
		: (msg: string) => {
				logger.info(msg, ['Mysql']);
		  };
const sequelize = new Sequelize(databaseName, username, pw, {
	host: host,
	dialect: 'mysql',
	logging,
});

const getModelList = async () => {
	const modelFolderPath = path.resolve(__dirname, '../model');
	const fileList = fs.readdirSync(modelFolderPath);

	const modelfileList = await pipe(
		fileList,
		filter(name => name.endsWith('.js') || name.endsWith('.ts')),
		toAsync,
		map(name => import(`${modelFolderPath}/${name}`)),
		concurrent(fileList.length),
		toArray,
	);

	const associateList = pipe(
		modelfileList,
		map(modelfile => modelfile.associate),
	);
	const modelList: TModelInfo = modelfileList.reduce((acc, cur) => {
		const key = cur.default.name;
		return { ...acc, [key]: cur.default };
	}, {});

	return {
		associateList,
		modelList,
	};
};

export const sync = async () => {
	try {
		const syncOptions = secret.nodeEnv === 'test' ? { force: true } : {};
		const modelInfo = await getModelList();

		for (const associate of modelInfo.associateList) {
			associate(modelInfo.modelList);
		}

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
