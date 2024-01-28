/* eslint-disable @typescript-eslint/no-unused-vars */
import GroupModel from '@/model/group';

import { CustomError } from '@/util/error/class';
import { TContext } from '@/util/error/class/interface';

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
	getCache3(key: string) {
		return Promise.resolve<string>('3');
	},
	getCache5(key: string) {
		return Promise.resolve<string>('5');
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
