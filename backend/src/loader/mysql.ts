import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { concurrent, filter, map, pipe, toArray, toAsync } from '@fxts/core';

import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import secret from '@/config/secret';

import { TModelInfo } from '@/interface/model';

const { databaseName, master, local, slave1 } = secret.mysql;

const isTestEnv = secret.nodeEnv === 'test';
const isProdEnv = secret.nodeEnv === 'production';
const sequelizeOptions = isTestEnv ? local : master;

const prodOption = {
	replication: {
		read: [
			{
				host: slave1.host,
				username: slave1.username,
				password: slave1.pw,
				port: slave1.port,
			},
		],
		write: {
			host: master.host,
			username: master.username,
			password: master.pw,
			port: master.port,
		},
	},
};
const devOption = {
	host: sequelizeOptions.host,
	port: sequelizeOptions.port,
};
const option = isProdEnv ? prodOption : devOption;

const logging = isTestEnv
	? false
	: (msg: string) => {
			logger.info(msg, ['Mysql']);
	  };

const sequelize = new Sequelize(
	databaseName,
	sequelizeOptions.username,
	sequelizeOptions.pw,
	{
		dialect: 'mysql',
		logging,
		...option,
	},
);

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
			developmentDocker: { alter: true },
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
