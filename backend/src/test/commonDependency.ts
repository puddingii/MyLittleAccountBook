/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize';

import GroupModel from '@/model/group';
import { CustomError } from '@/util/error/class';
import { TContext } from '@/util/error/class/interface';
import secret from '@/config/secret';

const { databaseName, host, pw, username } = secret.mysql;

export const sequelize = new Sequelize(databaseName, username, pw, {
	host: host,
	dialect: 'mysql',
});

export const errorUtil = {
	convertErrorToCustomError: (
		error: unknown,
		options: Partial<{
			cause: unknown;
			trace: string;
			context: TContext;
			code: number;
		}>,
	) => {
		return new CustomError((error as Error).message, { code: 400 });
	},
	CustomError: CustomError,
};

export const cacheUtil = {
	setCache(key: string, value: number | string | Buffer, time?: number) {
		return Promise.resolve<void>(undefined);
	},
	deleteCache(key: string | Array<string>) {
		return Promise.resolve<number>(1);
	},
	getCacheA(key: string) {
		return Promise.resolve<string>('A');
	},
	getCacheB(key: string) {
		return Promise.resolve<string>('B');
	},
	getNullCache(key: string) {
		return Promise.resolve<null>(null);
	},
};

export const jwtUtil = {
	createAccessToken(data: object) {
		return 'access token';
	},
	createRefreshToken() {
		return 'refresh token';
	},
	decodeToken<T>(token: string): T | null {
		return {} as T;
	},
	isExpiredTokenTrue(token?: string | undefined): token is undefined {
		return true;
	},
	isExpiredTokenFalse(token?: string | undefined): token is undefined {
		return false;
	},
	verifyAll(info: { refreshToken: string; accessToken: string }) {
		return Promise.resolve({ nickname: 'nickname', email: 'string' });
	},
	verifyAllError(info: { refreshToken: string; accessToken: string }) {
		throw new Error('error');
	},
};

export const validationUtil = {
	isAdminUserTrue: (userType: GroupModel['userType']) => true,
	isAdminUserFalse: (userType: GroupModel['userType']) => false,
	canUserWriteTrue: (userType: GroupModel['userType']) => true,
	canUserWriteFalse: (userType: GroupModel['userType']) => false,
};
