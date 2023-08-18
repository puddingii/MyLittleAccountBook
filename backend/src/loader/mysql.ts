import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

import { logger } from '@/util';
import secret from '@/config/secret';
import { convertErrorToCustomError } from '@/util/error';

const { databaseName, host, pw, username } = secret.mysql;

const sequelize = new Sequelize(databaseName, username, pw, {
	host: host,
	dialect: 'mysql',
	logging: msg => {
		logger.info(msg, ['Mysql']);
	},
});

const getModelList = async () => {
	const fileList = fs.readdirSync(path.resolve(__dirname, '../model'));
	const filteredFileList = fileList.filter(
		file => file.endsWith('.js') || file.endsWith('.ts'),
	);

	const importList = filteredFileList.map(fileName => import(`@/model/${fileName}`));
	const modelInfoList = await Promise.all(importList);

	const associateList = modelInfoList.map(modelInfo => modelInfo.associate);
	const modelList = modelInfoList.reduce((acc, cur) => {
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
		const syncOptions = secret.nodeEnv === 'production' ? {} : { force: true };
		const modelInfo = await getModelList();

		modelInfo.associateList.forEach(associate => associate(modelInfo.modelList));

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
		const { createEmailUser, test } = await import('../repository/userRepository');
		const { createCategory } = await import('../repository/categoryRepository');
		await createEmailUser({
			email: 'test@naver.com',
			password: 'test123!@TEST',
			nickname: 'testUser',
		});
		await test();

		await createCategory({
			name: '음식',
			accountBookId: 1,
		});
		await createCategory({
			name: '일식',
			accountBookId: 1,
			parentId: 1,
		});
		await createCategory({
			name: '초밥',
			accountBookId: 1,
			parentId: 2,
		});
		await createCategory({
			name: '오니기리',
			accountBookId: 1,
			parentId: 2,
		});
		await createCategory({
			name: '중식',
			accountBookId: 1,
			parentId: 1,
		});
		await createCategory({
			name: '짜장면',
			accountBookId: 1,
			parentId: 5,
		});
		await createCategory({
			name: '한식',
			accountBookId: 1,
			parentId: 1,
		});
		await createCategory({
			name: '비빔밥',
			accountBookId: 1,
			parentId: 7,
		});
		await createCategory({
			name: '육회비빔밥',
			accountBookId: 1,
			parentId: 8,
		});
		await createCategory({
			name: '냉면',
			accountBookId: 1,
			parentId: 7,
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
