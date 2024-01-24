import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { concurrent, filter, map, pipe, toArray, toAsync } from '@fxts/core';

import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import secret from '@/config/secret';

import { TModelInfo } from '@/interface/model';

const { databaseName, master } = secret.mysql;

const isTestEnvironment = secret.nodeEnv === 'test';
const logging = isTestEnvironment
	? false
	: (msg: string) => {
			logger.info(msg, ['Mysql']);
	  };

const sequelize = new Sequelize(databaseName, master.username, master.pw, {
	host: master.host,
	port: master.port,
	dialect: 'mysql',
	logging,
});

export const getModelList = async () => {
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

export const associateModel = (modelInfo: Awaited<ReturnType<typeof getModelList>>) => {
	for (const associate of modelInfo.associateList) {
		associate(modelInfo.modelList);
	}
};

export const sync = async (sequelize: Sequelize) => {
	try {
		const modelInfo = await getModelList();
		associateModel(modelInfo);

		await sequelize.authenticate();

		const syncType = {
			test: { force: true },
			development: { alter: true },
			production: {},
		};
		await sequelize.sync(syncType[secret.nodeEnv] ?? {});

		logger.info('Connection has been established successfully.', ['Mysql']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Mysql',
		});
		throw customError;
	}
};

export const closeConnection = async (sequelize: Sequelize) => {
	try {
		await sequelize.close();
		logger.info('Connection has been closed successfully.', ['Mysql']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Mysql' });
		throw customError;
	}
};

export default sequelize;
