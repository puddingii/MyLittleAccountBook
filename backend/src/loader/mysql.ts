import { Sequelize } from 'sequelize';

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
	const UserModel = await import('@/model/user');
	const OAuthUserModel = await import('@/model/oauthUser');
	const CategoryModel = await import('@/model/category');

	return {
		associateList: [
			UserModel.associate,
			OAuthUserModel.associate,
			CategoryModel.associate,
		],
		modelList: {
			UserModel: UserModel.default,
			OAuthUserModel: OAuthUserModel.default,
			CategoryModel: CategoryModel.default,
		},
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
		const { createEmailUser } = await import('../repository/userRepository');
		const { tcreateCategory } = await import('../repository/categoryRepository');
		await createEmailUser({
			email: 'test@naver.com',
			password: 'test123!@TEST',
			nickname: 'testUser',
		});
		await tcreateCategory({
			name: '음식',
		});
		await tcreateCategory({
			name: '일식',
			parentId: 1,
		});
		await tcreateCategory({
			name: '초밥',
			parentId: 2,
		});
		await tcreateCategory({
			name: '오니기리',
			parentId: 2,
		});
		await tcreateCategory({
			name: '중식',
			parentId: 1,
		});
		await tcreateCategory({
			name: '짜장면',
			parentId: 5,
		});
		await tcreateCategory({
			name: '한식',
			parentId: 1,
		});
		await tcreateCategory({
			name: '비빔밥',
			parentId: 7,
		});
		await tcreateCategory({
			name: '육회비빔밥',
			parentId: 8,
		});
		await tcreateCategory({
			name: '냉면',
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
