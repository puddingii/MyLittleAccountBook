/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import sinon from 'sinon';

/** Service */
import { getUserInfo, updateUserInfoAndRefreshToken } from '@/service/userService';

/** Dependency */
import {
	findUserInfoWithPrivacyAndOAuth,
	updateUserInfo,
} from '@/repository/userRepository/dependency';

/** Model */
import UserModel from '@/model/user';
import OAuthUserModel from '@/model/oauthUser';

import { cacheUtil, errorUtil, jwtUtil } from '../commonDependency';
import UserPrivacyModel from '@/model/userPrivacy';

describe('User Service Test', function () {
	const userInfo = {
		email: 'test@naver.com',
		nickname: 'testNickname',
		myEmail: 'test@naver.com',
	};
	const privacy = {
		isAuthenticated: true,
		isGroupInvitationOn: true,
		isPublicUser: true,
	};

	describe('#getUserInfo', function () {
		const common = {
			errorUtil: { convertErrorToCustomError: errorUtil.convertErrorToCustomError },
		};
		const repository = { findUserInfoWithPrivacyAndOAuth };
		let stubFindUserInfoWithPrivacyAndOAuth = sinon.stub(
			repository,
			'findUserInfoWithPrivacyAndOAuth',
		);

		beforeEach(function () {
			stubFindUserInfoWithPrivacyAndOAuth = sinon.stub(
				repository,
				'findUserInfoWithPrivacyAndOAuth',
			);
		});

		it('Check function parameters', async function () {
			const user = new UserModel({ ...userInfo });
			user.userprivacy = new UserPrivacyModel({
				...privacy,
				userEmail: user.email,
			});
			stubFindUserInfoWithPrivacyAndOAuth.resolves(user);

			const injectedFunc = getUserInfo({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...userInfo });

				sinon.assert.calledWith(stubFindUserInfoWithPrivacyAndOAuth, {
					email: userInfo.email,
					nickname: userInfo.nickname,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct Email User', async function () {
			const user = new UserModel({ ...userInfo });
			user.userprivacy = new UserPrivacyModel({
				...privacy,
				userEmail: user.email,
			});
			stubFindUserInfoWithPrivacyAndOAuth.resolves(user);

			const injectedFunc = getUserInfo({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...userInfo });

				equal(userInfo.email, result.email);
				equal(userInfo.nickname, result.nickname);
				equal(privacy.isAuthenticated, result.isAuthenticated);
				equal(privacy.isGroupInvitationOn, result.isGroupInvitationOn);
				equal(privacy.isPublicUser, result.isPublicUser);
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
			const privacyModel = new UserPrivacyModel({
				...privacy,
				userEmail: userModel.email,
			});
			userModel.oauthusers = [oauthModel];
			userModel.userprivacy = privacyModel;
			stubFindUserInfoWithPrivacyAndOAuth.resolves(userModel);

			const injectedFunc = getUserInfo({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...userInfo });

				equal(userInfo.email, result.email);
				equal(userInfo.nickname, result.nickname);
				equal(privacy.isAuthenticated, result.isAuthenticated);
				equal(privacy.isGroupInvitationOn, result.isGroupInvitationOn);
				equal(privacy.isPublicUser, result.isPublicUser);
				equal('Google', result.socialType);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Unknown User', async function () {
			stubFindUserInfoWithPrivacyAndOAuth.resolves(null);

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

				sinon.assert.calledWith(stubUpdateUserInfo, {
					email: userInfo.email,
					nickname: userInfo.nickname,
				});
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
