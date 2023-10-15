/* eslint-disable @typescript-eslint/no-unused-vars */
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
		return new CustomError('에러', { code: 400 });
	},
	CustomError: CustomError,
};

export const cacheUtil = {
	setCache(key: string, value: number | string | Buffer, time?: number) {
		return Promise.resolve<void>(undefined);
	},
	deleteCache(key: string | Array<string>) {
		return Promise.resolve<void>(undefined);
	},
	getCacheA(key: string) {
		return Promise.resolve<string>('A');
	},
	getCacheB(key: string) {
		return Promise.resolve<string>('B');
	},
	getNullCache(key: string) {
		return Promise.resolve<void>(undefined);
	},
};

export const jwtUtil = {
	createAccessToken(data: object) {
		return 'access token';
	},
	createRefreshToken() {
		return 'access token';
	},
	decodeToken<T>(token: string): T | null {
		return {} as T;
	},
	isExpiredTokenTrue(token?: string | undefined) {
		return true;
	},
	isExpiredTokenFalse(token?: string | undefined) {
		return false;
	},
	verifyAll(info: { refreshToken: string; accessToken: string }) {
		return Promise.resolve({ nickname: 'nickname', email: 'string' });
	},
	verifyAllError(info: { refreshToken: string; accessToken: string }) {
		throw new Error('error');
	},
};
