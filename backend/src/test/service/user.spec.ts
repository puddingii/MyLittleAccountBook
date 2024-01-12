/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import sinon from 'sinon';

/** Service */
import { getUserInfo, updateUserInfoAndRefreshToken } from '@/service/userService';

/** Dependency */
import { findUserInfo, updateUserInfo } from '@/repository/userRepository/dependency';

/** Model */
import UserModel from '@/model/user';
import OAuthUserModel from '@/model/oauthUser';

import { cacheUtil, errorUtil, jwtUtil } from '../commonDependency';

describe('User Service Test', function () {
	const userInfo = {
		email: 'test@naver.com',
		nickname: 'testNickname',
	};

	describe('#getUserInfo', function () {
		const common = {
			errorUtil: { convertErrorToCustomError: errorUtil.convertErrorToCustomError },
		};
		const repository = { findUserInfo };
		let stubFindUserInfo = sinon.stub(repository, 'findUserInfo');

		beforeEach(function () {
			stubFindUserInfo = sinon.stub(repository, 'findUserInfo');
		});

		it('Check function parameters', async function () {
			stubFindUserInfo.resolves(new UserModel({ ...userInfo }));

			const injectedFunc = getUserInfo({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...userInfo });

				sinon.assert.calledWith(stubFindUserInfo, { ...userInfo });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct Email User', async function () {
			stubFindUserInfo.resolves(new UserModel({ ...userInfo }));

			const injectedFunc = getUserInfo({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...userInfo });

				equal(userInfo.email, result.email);
				equal(userInfo.nickname, result.nickname);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct OAuth User', async function () {
			const userModel = new UserModel({ ...userInfo });
			const oauthModel = new OAuthUserModel({
				type: 'Google',
				userEmail: userModel.email,
			});
			userModel.oauthusers = [oauthModel];
			stubFindUserInfo.resolves(userModel);

			const injectedFunc = getUserInfo({
				...common,
				repository,
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
			stubFindUserInfo.resolves(null);

			const injectedFunc = getUserInfo({
				...common,
				repository,
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
			stubFindUserInfo.resolves(
				new UserModel({
					email: 'test2@naver.com',
					nickname: 'test2Nickname',
				}),
			);

			const injectedFunc = getUserInfo({
				...common,
				repository,
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
		const repository = { updateUserInfo };
		let stubUpdateUserInfo = sinon.stub(repository, 'updateUserInfo');

		beforeEach(function () {
			stubUpdateUserInfo = sinon.stub(repository, 'updateUserInfo');
		});

		it('Check function parameters', async function () {
			stubUpdateUserInfo.resolves([1]);

			const injectedFunc = updateUserInfoAndRefreshToken({
				...common,
				cacheUtil: { setCache },
				jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
				repository,
			});

			try {
				await injectedFunc({
					...userInfo,
					accessToken: '',
					refreshToken: '',
				});

				sinon.assert.calledWith(stubUpdateUserInfo, { ...userInfo });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubUpdateUserInfo.resolves([1]);

			const injectedFunc = updateUserInfoAndRefreshToken({
				...common,
				cacheUtil: { setCache },
				jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
				repository,
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
			stubUpdateUserInfo.resolves([1]);

			const injectedFunc = updateUserInfoAndRefreshToken({
				...common,
				cacheUtil: { setCache },
				jwtUtil: { createAccessToken, createRefreshToken, verifyAll: verifyAllError },
				repository,
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
			stubUpdateUserInfo.resolves([0]);

			const injectedFunc = updateUserInfoAndRefreshToken({
				...common,
				cacheUtil: { setCache },
				jwtUtil: { createAccessToken, createRefreshToken, verifyAll },
				repository,
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
			stubUpdateUserInfo.resolves([1]);

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
				repository,
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
