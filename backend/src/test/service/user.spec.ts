/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';

import { getUserInfo, updateUserInfoAndRefreshToken } from '@/service/userService';
import UserModel from '@/model/user';
import OAuthUserModel from '@/model/oauthUser';

import { cacheUtil, errorUtil, jwtUtil } from '../commonDependency';

describe('User Service Test', function () {
	const userInfo = { email: 'test@naver.com', nickname: 'testNickname' };
	describe('#getUserInfo', function () {
		const common = {
			errorUtil: { convertErrorToCustomError: errorUtil.convertErrorToCustomError },
		};

		it('Correct Email User', async function () {
			const injectedFunc = getUserInfo({
				...common,
				repository: {
					findUserInfo: (
						info: Partial<{
							email: string;
							nickname: string;
						}>,
					) => {
						const userModel = new UserModel({ ...userInfo });
						return Promise.resolve(userModel);
					},
				},
			});

			try {
				const result = await injectedFunc({ ...userInfo });
				equal(userInfo.email, result.email);
				equal(userInfo.nickname, result.nickname);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Correct OAuth User', async function () {
			const injectedFunc = getUserInfo({
				...common,
				repository: {
					findUserInfo: (
						info: Partial<{
							email: string;
							nickname: string;
						}>,
					) => {
						const userModel = new UserModel({ ...userInfo });
						const oauthModel = new OAuthUserModel({
							type: 'Google',
							userEmail: userModel.email,
						});
						userModel.oauthusers = [oauthModel];
						return Promise.resolve(userModel);
					},
				},
			});

			try {
				const result = await injectedFunc({ ...userInfo });
				equal(userInfo.email, result.email);
				equal(userInfo.nickname, result.nickname);
				equal('Google', result.socialType);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Unknown User', async function () {
			const injectedFunc = getUserInfo({
				...common,
				repository: {
					findUserInfo: (
						info: Partial<{
							email: string;
							nickname: string;
						}>,
					) => {
						return Promise.resolve(null);
					},
				},
			});

			try {
				const result = await injectedFunc({ ...userInfo });
				fail(`Result is expected to null: ${result}`);
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});

		it('params data !== result data', async function () {
			const injectedFunc = getUserInfo({
				...common,
				repository: {
					findUserInfo: (
						info: Partial<{
							email: string;
							nickname: string;
						}>,
					) => {
						return Promise.resolve(
							new UserModel({ email: 'test2@naver.com', nickname: 'test2Nickname' }),
						);
					},
				},
			});

			try {
				await injectedFunc({ ...userInfo });
				fail(
					`Repository or DB Error. The result does not match the user's nickname or email: ${8}`,
				);
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});
	});

	describe('#updateUserInfoAndRefreshToken', function () {
		const { createAccessToken, createRefreshToken, verifyAll, verifyAllError } = jwtUtil;
		const { setCache } = cacheUtil;
		const { CustomError, convertErrorToCustomError } = errorUtil;
		const common = {
			errorUtil: {
				convertErrorToCustomError,
				CustomError,
			},
		};

		it('Correct', async function () {
			const injectedFunc = updateUserInfoAndRefreshToken({
				...common,
				cacheUtil: { setCache },
				jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
				repository: {
					updateUserInfo: (info: { email: string; nickname: string }) => {
						return Promise.resolve([1] as [affectedCount: number]);
					},
				},
			});

			try {
				const result = await injectedFunc({
					...userInfo,
					accessToken: '',
					refreshToken: '',
				});

				equal(typeof result.accessToken, 'string');
				equal(typeof result.refreshToken, 'string');
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Incorrect token', async function () {
			const injectedFunc = updateUserInfoAndRefreshToken({
				...common,
				cacheUtil: { setCache },
				jwtUtil: { createAccessToken, createRefreshToken, verifyAll: verifyAllError },
				repository: {
					updateUserInfo: (info: { email: string; nickname: string }) => {
						return Promise.resolve([1] as [affectedCount: number]);
					},
				},
			});

			try {
				await injectedFunc({
					...userInfo,
					accessToken: '',
					refreshToken: '',
				});
				fail('Expected to error that refresh token or access token is not verified.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});

		it('Update DB error', async function () {
			const injectedFunc = updateUserInfoAndRefreshToken({
				...common,
				cacheUtil: { setCache },
				jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
				repository: {
					updateUserInfo: (info: { email: string; nickname: string }) => {
						return Promise.resolve([0] as [affectedCount: number]);
					},
				},
			});

			try {
				await injectedFunc({
					...userInfo,
					accessToken: '',
					refreshToken: '',
				});
				fail('Expected to error that user information is not updated.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});

		it('Set cache error', async function () {
			const injectedFunc = updateUserInfoAndRefreshToken({
				...common,
				cacheUtil: {
					setCache: () => {
						return new Promise(() => {
							throw new Error('cache error');
						});
					},
				},
				jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
				repository: {
					updateUserInfo: (info: { email: string; nickname: string }) => {
						return Promise.resolve([1] as [affectedCount: number]);
					},
				},
			});

			try {
				await injectedFunc({
					...userInfo,
					accessToken: '',
					refreshToken: '',
				});
				fail('Expected to error that cache setting error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});
	});
});
