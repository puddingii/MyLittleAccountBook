/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepStrictEqual, equal, fail } from 'assert';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid/async';

/** Service */
import {
	deleteToken,
	emailJoin,
	emailLogin,
	getSocialLoginLocation,
	isValidatedState,
	refreshToken,
	resendVerificationEmail,
	socialLogin,
	verifyEmail,
} from '@/service/authService';

/** Dependency */
import {
	createEmailUser,
	createSocialUser,
	findOneSocialUserInfo,
	findOneUser,
} from '@/repository/authRepository/dependency';
import {
	findUserPrivacy,
	updateUserPrivacy,
} from '@/repository/userPrivacyRepository/dependency';
import { errorUtil, cacheUtil, jwtUtil } from '../commonDependency';
import { SOCIAL_URL_MANAGER } from '@/service/authService/socialManager';
import { sendVerificationEmail } from '@/service/common/user/dependency';
import {
	createAccessToken,
	createRefreshToken,
	decodeToken,
	isExpiredToken,
} from '@/util/jwt';
import { deleteCache, getCache } from '@/util/cache';
import secret from '@/config/secret';
import authEvent from '@/pubsub/authPubsub';
import TypeEmitter from '@/pubsub/class';

/** Model */
import UserModel from '@/model/user';
import GroupModel from '@/model/group';
import OAuthUserModel from '@/model/oauthUser';

/** Interface */
import { TUserInfo } from '@/interface/user';
import { TAuthEvent } from '@/interface/pubsub/auth';
import UserPrivacyModel from '@/model/userPrivacy';
import { getEmailVerificationStateCache } from '@/util/cache/v2';

describe('Group Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};
	const password = 'asdf';
	let encryptedPassword: string;

	before(async function () {
		encryptedPassword = await bcrypt.hash(password, 10);
	});

	describe('#emailJoin', function () {
		const repository = { createEmailUser };
		let stubCreateEmailUser: sinon.SinonStub<
			[userInfo: TUserInfo],
			Promise<{
				accountBookId: number;
			}>
		>;
		let stubEventEmitter: sinon.SinonStubbedInstance<TypeEmitter<TAuthEvent>>;

		beforeEach(function () {
			stubCreateEmailUser = sinon.stub(repository, 'createEmailUser');
			stubEventEmitter = sinon.stub(authEvent);
		});

		it('Check function parameters', async function () {
			stubCreateEmailUser.resolves({ accountBookId: 1 });
			const userInfo = { email: 'test@naver.com', nickname: 'test', password: 'asdf' };

			const injectedFunc = emailJoin({
				...common,
				eventEmitter: stubEventEmitter,
				repository,
			});

			try {
				await injectedFunc(userInfo);

				sinon.assert.calledOnce(stubCreateEmailUser);
				sinon.assert.calledWith(stubCreateEmailUser, userInfo);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubCreateEmailUser.resolves({ accountBookId: 1 });

			const injectedFunc = emailJoin({
				...common,
				eventEmitter: stubEventEmitter,
				repository,
			});

			try {
				const result = await injectedFunc({
					email: 'test@naver.com',
					nickname: 'test',
					password: 'asdf',
				});

				equal(result.accountBookId, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If createEmailUser error', async function () {
			stubCreateEmailUser.rejects(new Error('createEmailUser error'));

			const injectedFunc = emailJoin({
				...common,
				eventEmitter: stubEventEmitter,
				repository,
			});

			try {
				await injectedFunc({
					email: 'test@naver.com',
					nickname: 'test',
					password: 'asdf',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCreateEmailUser);
			}
		});
	});

	describe('#emailLogin', function () {
		const repository = { findOneUser };
		let stubFindOneUser: sinon.SinonStub<
			[userInfo: Partial<TUserInfo>],
			Promise<UserModel | undefined>
		>;
		let spyBcrypt: sinon.SinonSpy<
			[
				data: string | Buffer,
				encrypted: string,
				callback: (err: Error | undefined, same: boolean) => boolean,
			],
			void
		>;

		const emailUserInfo = {
			email: 'test@naver.com',
			password: '',
			nickname: 'test',
		};

		before(function () {
			emailUserInfo.password = encryptedPassword;
		});

		beforeEach(function () {
			stubFindOneUser = sinon.stub(repository, 'findOneUser');
			spyBcrypt = sinon.spy(bcrypt, 'compare');
		});

		it('Check function parameters', async function () {
			const user = new UserModel(emailUserInfo);
			const userGroup = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});
			user.groups = [userGroup];
			stubFindOneUser.resolves(user);

			const injectedFunc = emailLogin({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
				jwtUtil: {
					createAccessToken: jwtUtil.createAccessToken,
					createRefreshToken: jwtUtil.createRefreshToken,
				},
				repository,
			});

			try {
				await injectedFunc({ email: emailUserInfo.email, password });

				spyBcrypt.calledWith(password, encryptedPassword);
				sinon.assert.calledOnce(spyBcrypt);
				sinon.assert.calledOnceWithExactly(stubFindOneUser, {
					email: emailUserInfo.email,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			const user = new UserModel(emailUserInfo);
			const userGroup = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});
			user.groups = [userGroup];
			stubFindOneUser.resolves(user);

			const injectedFunc = emailLogin({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
				jwtUtil: {
					createAccessToken: jwtUtil.createAccessToken,
					createRefreshToken: jwtUtil.createRefreshToken,
				},
				repository,
			});

			try {
				const result = await injectedFunc({ email: emailUserInfo.email, password });

				deepStrictEqual(result, {
					refreshToken: 'refresh token',
					accessToken: 'access token',
					accountBookId: 1,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result(Group join info is not existed)', async function () {
			const user = new UserModel(emailUserInfo);
			stubFindOneUser.resolves(user);

			const injectedFunc = emailLogin({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
				jwtUtil: {
					createAccessToken: jwtUtil.createAccessToken,
					createRefreshToken: jwtUtil.createRefreshToken,
				},
				repository,
			});

			try {
				const result = await injectedFunc({ email: emailUserInfo.email, password });

				deepStrictEqual(result, {
					refreshToken: 'refresh token',
					accessToken: 'access token',
					accountBookId: undefined,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If user is undefined', async function () {
			stubFindOneUser.resolves(undefined);

			const injectedFunc = emailLogin({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
				jwtUtil: {
					createAccessToken: jwtUtil.createAccessToken,
					createRefreshToken: jwtUtil.createRefreshToken,
				},
				repository,
			});

			try {
				await injectedFunc({ email: emailUserInfo.email, password });

				fail('Expected to erro');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindOneUser);
				sinon.assert.notCalled(spyBcrypt);
			}
		});

		it('If user password is undefined', async function () {
			const user = new UserModel({
				email: 'test@naver.com',
				nickname: 'test',
			});
			const userGroup = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});
			user.groups = [userGroup];
			stubFindOneUser.resolves(user);

			const injectedFunc = emailLogin({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
				jwtUtil: {
					createAccessToken: jwtUtil.createAccessToken,
					createRefreshToken: jwtUtil.createRefreshToken,
				},
				repository,
			});

			try {
				await injectedFunc({ email: emailUserInfo.email, password });

				fail('Expected to erro');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindOneUser);
				sinon.assert.notCalled(spyBcrypt);
			}
		});

		it("If user's password is not valid", async function () {
			const user = new UserModel({ ...emailUserInfo, password: 'wrong password' });
			const userGroup = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});
			user.groups = [userGroup];
			stubFindOneUser.resolves(user);

			const injectedFunc = emailLogin({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
				jwtUtil: {
					createAccessToken: jwtUtil.createAccessToken,
					createRefreshToken: jwtUtil.createRefreshToken,
				},
				repository,
			});

			try {
				await injectedFunc({ email: emailUserInfo.email, password });

				fail('Expected to erro');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindOneUser);
				sinon.assert.calledOnce(spyBcrypt);
			}
		});
	});

	describe('#getSocialLoginLocation', function () {
		let stubGoogleManager: sinon.SinonStub<[state: string], string>;
		let stubNaverManager: sinon.SinonStub<[state: string], string>;
		let spyNanoid: sinon.SinonSpy<[size?: number | undefined], Promise<string>>;

		beforeEach(function () {
			stubGoogleManager = sinon.stub(SOCIAL_URL_MANAGER, 'Google');
			stubNaverManager = sinon.stub(SOCIAL_URL_MANAGER, 'Naver');
			spyNanoid = sinon.spy(nanoid);
		});

		it('Check function parameters', async function () {
			const url = 'google url';
			stubGoogleManager.returns(url);

			const injectedFunc = getSocialLoginLocation({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
			});

			try {
				await injectedFunc('Google');

				/** Nanoid의 경우 랜덤한 String값을 리턴하기 때문에 값 비교 불가 */
				spyNanoid.alwaysReturned(15);
				sinon.assert.calledOnce(stubGoogleManager);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("Check google's correct result", async function () {
			const url = 'google url';
			stubGoogleManager.returns(url);

			const injectedFunc = getSocialLoginLocation({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
			});

			try {
				const result = await injectedFunc('Google');

				equal(result, url);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If google manager error', async function () {
			stubGoogleManager.throws(new Error('google manager error'));

			const injectedFunc = getSocialLoginLocation({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
			});

			try {
				await injectedFunc('Google');

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGoogleManager);
			}
		});

		it("Check naver's correct result", async function () {
			const url = 'naver url';
			stubNaverManager.returns(url);

			const injectedFunc = getSocialLoginLocation({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
			});

			try {
				const result = await injectedFunc('Naver');

				equal(result, url);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If naver manager error', async function () {
			stubNaverManager.throws(new Error('naver manager error'));

			const injectedFunc = getSocialLoginLocation({
				...common,
				cacheUtil: { setCache: cacheUtil.setCache },
			});

			try {
				await injectedFunc('Naver');

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubNaverManager);
			}
		});
	});

	describe('#isValidatedState', function () {
		const state = 'state';
		const cacheUtil = { getCache, deleteCache };

		let stubGetCache = sinon.stub(cacheUtil, 'getCache');
		let stubDeleteCache = sinon.stub(cacheUtil, 'deleteCache');

		beforeEach(function () {
			stubGetCache = sinon.stub(cacheUtil, 'getCache');
			stubDeleteCache = sinon.stub(cacheUtil, 'deleteCache');
		});

		it('Check function parameters', async function () {
			stubGetCache.resolves('cached information');
			stubDeleteCache.resolves();

			try {
				await isValidatedState(cacheUtil, state);

				sinon.assert.calledWith(stubGetCache, state);
				sinon.assert.calledWith(stubDeleteCache, state);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubGetCache.resolves('cached information');
			stubDeleteCache.resolves();

			try {
				const result = await isValidatedState(cacheUtil, state);

				equal(result, true);
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubDeleteCache);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If state is undefined', async function () {
			stubGetCache.resolves('cached information');
			stubDeleteCache.resolves();

			try {
				const result = await isValidatedState(cacheUtil);

				equal(result, false);
				sinon.assert.notCalled(stubGetCache);
				sinon.assert.notCalled(stubDeleteCache);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If getCache return null', async function () {
			stubGetCache.resolves(null);
			stubDeleteCache.resolves();

			try {
				const result = await isValidatedState(cacheUtil, state);

				equal(result, false);
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.notCalled(stubDeleteCache);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If deleteCache error', async function () {
			stubGetCache.resolves('cached information');
			stubDeleteCache.rejects(new Error('deleteCache error'));

			try {
				await isValidatedState(cacheUtil, state);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubDeleteCache);
			}
		});
	});

	describe('#socialLogin', function () {
		const repository = { createSocialUser, findOneSocialUserInfo };
		const customCacheUtil = { setCache: cacheUtil.setCache };
		const jwtUtil = { createAccessToken, createRefreshToken };

		let stubCreateSocialUser = sinon.stub(repository, 'createSocialUser');
		let stubFindOneSocialUserInfo = sinon.stub(repository, 'findOneSocialUserInfo');
		let stubSetCache = sinon.stub(customCacheUtil, 'setCache');
		let stubCreateAccessToken = sinon.stub(jwtUtil, 'createAccessToken');
		let stubCreateRefreshToken = sinon.stub(jwtUtil, 'createRefreshToken');

		beforeEach(function () {
			stubCreateSocialUser = sinon.stub(repository, 'createSocialUser');
			stubFindOneSocialUserInfo = sinon.stub(repository, 'findOneSocialUserInfo');
			stubSetCache = sinon.stub(customCacheUtil, 'setCache');
			stubCreateAccessToken = sinon.stub(jwtUtil, 'createAccessToken');
			stubCreateRefreshToken = sinon.stub(jwtUtil, 'createRefreshToken');
		});

		it('Check function parameters(oauth user is existed)', async function () {
			const userInfo = {
				email: 'test@naver.com',
				nickname: 'test',
			};
			const tokenInfo = { accessToken: 'access token', refreshToken: 'refresh token' };
			const user = new UserModel(userInfo);
			const oauth = new OAuthUserModel({ userEmail: user.email, type: 'Google' });
			const group = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});

			user.oauthusers = [oauth];
			user.groups = [group];

			stubFindOneSocialUserInfo.resolves(user);
			stubCreateSocialUser.resolves({
				accountBookId: 1,
				newUser: new UserModel(userInfo),
			});
			stubCreateAccessToken.returns(tokenInfo.accessToken);
			stubCreateRefreshToken.returns(tokenInfo.refreshToken);
			stubSetCache.resolves();

			try {
				await socialLogin(
					{
						cacheUtil: { ...customCacheUtil },
						jwtUtil,
						repository,
					},
					{ type: 'Google', user: userInfo },
				);

				sinon.assert.calledWith(
					stubFindOneSocialUserInfo,
					{ email: userInfo.email },
					'Google',
				);
				sinon.assert.calledWith(stubCreateAccessToken, userInfo);
				sinon.assert.calledWith(stubCreateRefreshToken);
				sinon.assert.calledWith(
					stubSetCache,
					userInfo.email,
					tokenInfo.refreshToken,
					secret.express.jwtRefreshTokenTime,
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result(oauth user is existed)', async function () {
			const userInfo = {
				email: 'test@naver.com',
				nickname: 'test',
			};
			const tokenInfo = { accessToken: 'access token', refreshToken: 'refresh token' };
			const user = new UserModel(userInfo);
			const oauth = new OAuthUserModel({ userEmail: user.email, type: 'Google' });
			const group = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});

			user.oauthusers = [oauth];
			user.groups = [group];

			stubFindOneSocialUserInfo.resolves(user);
			stubCreateSocialUser.resolves({
				accountBookId: 1,
				newUser: new UserModel(userInfo),
			});
			stubCreateAccessToken.returns(tokenInfo.accessToken);
			stubCreateRefreshToken.returns(tokenInfo.refreshToken);
			stubSetCache.resolves();

			try {
				const result = await socialLogin(
					{
						cacheUtil: { ...customCacheUtil },
						jwtUtil,
						repository,
					},
					{ type: 'Google', user: { email: 'test@naver.com', nickname: 'test' } },
				);

				sinon.assert.calledOnce(stubFindOneSocialUserInfo);
				sinon.assert.notCalled(stubCreateSocialUser);
				sinon.assert.calledOnce(stubCreateAccessToken);
				sinon.assert.calledOnce(stubCreateRefreshToken);
				sinon.assert.calledOnce(stubSetCache);
				deepStrictEqual(result, { ...tokenInfo, accountBookId: 1 });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result(oauth user is existed and group join info is not existed)', async function () {
			const userInfo = {
				email: 'test@naver.com',
				nickname: 'test',
			};
			const tokenInfo = { accessToken: 'access token', refreshToken: 'refresh token' };
			const user = new UserModel(userInfo);
			const oauth = new OAuthUserModel({ userEmail: user.email, type: 'Google' });

			user.oauthusers = [oauth];

			stubFindOneSocialUserInfo.resolves(user);
			stubCreateSocialUser.resolves({
				accountBookId: 1,
				newUser: new UserModel(userInfo),
			});
			stubCreateAccessToken.returns(tokenInfo.accessToken);
			stubCreateRefreshToken.returns(tokenInfo.refreshToken);
			stubSetCache.resolves();

			try {
				const result = await socialLogin(
					{
						cacheUtil: { ...customCacheUtil },
						jwtUtil,
						repository,
					},
					{ type: 'Google', user: { email: 'test@naver.com', nickname: 'test' } },
				);

				sinon.assert.calledOnce(stubFindOneSocialUserInfo);
				sinon.assert.notCalled(stubCreateSocialUser);
				sinon.assert.calledOnce(stubCreateAccessToken);
				sinon.assert.calledOnce(stubCreateRefreshToken);
				sinon.assert.calledOnce(stubSetCache);
				deepStrictEqual(result, { ...tokenInfo, accountBookId: undefined });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('User is existed but user is not oauthuser', async function () {
			const userInfo = {
				email: 'test@naver.com',
				nickname: 'test',
			};
			const tokenInfo = { accessToken: 'access token', refreshToken: 'refresh token' };
			const user = new UserModel(userInfo);
			const group = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});

			user.groups = [group];

			stubFindOneSocialUserInfo.resolves(user);
			stubCreateSocialUser.resolves({
				accountBookId: 1,
				newUser: new UserModel(userInfo),
			});
			stubCreateAccessToken.returns(tokenInfo.accessToken);
			stubCreateRefreshToken.returns(tokenInfo.refreshToken);
			stubSetCache.resolves();

			try {
				await socialLogin(
					{
						cacheUtil: { ...customCacheUtil },
						jwtUtil,
						repository,
					},
					{ type: 'Google', user: { email: 'test@naver.com', nickname: 'test' } },
				);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindOneSocialUserInfo);
				sinon.assert.notCalled(stubCreateSocialUser);
				sinon.assert.notCalled(stubCreateAccessToken);
				sinon.assert.notCalled(stubCreateRefreshToken);
				sinon.assert.notCalled(stubSetCache);
			}
		});

		it('Check function parameters(user is not existed)', async function () {
			const userInfo = {
				email: 'test@naver.com',
				nickname: 'test',
			};
			const tokenInfo = { accessToken: 'access token', refreshToken: 'refresh token' };
			const user = new UserModel(userInfo);
			const oauth = new OAuthUserModel({ userEmail: user.email, type: 'Google' });
			const group = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});

			user.oauthusers = [oauth];
			user.groups = [group];

			stubFindOneSocialUserInfo.resolves(undefined);
			stubCreateSocialUser.resolves({
				accountBookId: 1,
				newUser: user,
			});
			stubCreateAccessToken.returns(tokenInfo.accessToken);
			stubCreateRefreshToken.returns(tokenInfo.refreshToken);
			stubSetCache.resolves();

			try {
				await socialLogin(
					{
						cacheUtil: { ...customCacheUtil },
						jwtUtil,
						repository,
					},
					{ type: 'Google', user: userInfo },
				);

				sinon.assert.calledWith(
					stubFindOneSocialUserInfo,
					{ email: userInfo.email },
					'Google',
				);
				sinon.assert.calledWith(stubCreateSocialUser, { userInfo, socialType: 'Google' });
				sinon.assert.calledWith(stubCreateAccessToken, userInfo);
				sinon.assert.calledWith(stubCreateRefreshToken);
				sinon.assert.calledWith(
					stubSetCache,
					userInfo.email,
					tokenInfo.refreshToken,
					secret.express.jwtRefreshTokenTime,
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result(user is not existed)', async function () {
			const userInfo = {
				email: 'test@naver.com',
				nickname: 'test',
			};
			const tokenInfo = { accessToken: 'access token', refreshToken: 'refresh token' };
			const user = new UserModel(userInfo);
			const oauth = new OAuthUserModel({ userEmail: user.email, type: 'Google' });
			const group = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});

			user.oauthusers = [oauth];
			user.groups = [group];

			stubFindOneSocialUserInfo.resolves(undefined);
			stubCreateSocialUser.resolves({
				accountBookId: 1,
				newUser: user,
			});
			stubCreateAccessToken.returns(tokenInfo.accessToken);
			stubCreateRefreshToken.returns(tokenInfo.refreshToken);
			stubSetCache.resolves();

			try {
				const result = await socialLogin(
					{
						cacheUtil: { ...customCacheUtil },
						jwtUtil,
						repository,
					},
					{ type: 'Google', user: { email: 'test@naver.com', nickname: 'test' } },
				);

				sinon.assert.calledOnce(stubFindOneSocialUserInfo);
				sinon.assert.calledOnce(stubCreateSocialUser);
				sinon.assert.calledOnce(stubCreateAccessToken);
				sinon.assert.calledOnce(stubCreateRefreshToken);
				sinon.assert.calledOnce(stubSetCache);
				deepStrictEqual(result, { ...tokenInfo, accountBookId: 1 });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('User is not existed and createSocialUser error', async function () {
			const userInfo = {
				email: 'test@naver.com',
				nickname: 'test',
			};
			const tokenInfo = { accessToken: 'access token', refreshToken: 'refresh token' };
			const user = new UserModel(userInfo);
			const oauth = new OAuthUserModel({ userEmail: user.email, type: 'Google' });
			const group = new GroupModel({
				userEmail: user.email,
				userType: 'owner',
				accountBookId: 1,
			});

			user.oauthusers = [oauth];
			user.groups = [group];

			stubFindOneSocialUserInfo.resolves(undefined);
			stubCreateSocialUser.rejects(new Error('createSocialUser error'));
			stubCreateAccessToken.returns(tokenInfo.accessToken);
			stubCreateRefreshToken.returns(tokenInfo.refreshToken);
			stubSetCache.resolves();

			try {
				await socialLogin(
					{
						cacheUtil: { ...customCacheUtil },
						jwtUtil,
						repository,
					},
					{ type: 'Google', user: { email: 'test@naver.com', nickname: 'test' } },
				);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindOneSocialUserInfo);
				sinon.assert.calledOnce(stubCreateSocialUser);
				sinon.assert.notCalled(stubCreateAccessToken);
				sinon.assert.notCalled(stubCreateRefreshToken);
				sinon.assert.notCalled(stubSetCache);
			}
		});
	});

	describe('#refreshToken', function () {
		const customJwtUtil = {
			createAccessToken,
			decodeToken,
			isExpiredToken,
		};
		const customCacheUtil = {
			getCache,
		};
		let stubIsExpiredToken = sinon.stub(customJwtUtil, 'isExpiredToken');
		let stubCreateAccessToken = sinon.stub(customJwtUtil, 'createAccessToken');
		let stubDecodeToken = sinon.stub(customJwtUtil, 'decodeToken');
		let stubGetCache = sinon.stub(customCacheUtil, 'getCache');
		const tokenInfo = {
			email: 'test@naver.com',
			nickname: 'test',
		};

		beforeEach(function () {
			stubIsExpiredToken = sinon.stub(customJwtUtil, 'isExpiredToken');
			stubCreateAccessToken = sinon.stub(customJwtUtil, 'createAccessToken');
			stubDecodeToken = sinon.stub(customJwtUtil, 'decodeToken');
			stubGetCache = sinon.stub(customCacheUtil, 'getCache');
		});

		it('Check function parameters', async function () {
			stubIsExpiredToken.withArgs('access token').returns(false);
			stubIsExpiredToken.withArgs('refresh token').returns(false);
			stubDecodeToken.returns(tokenInfo);
			stubCreateAccessToken.returns('new access token');
			stubGetCache.resolves('refresh token');

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.calledWith(stubIsExpiredToken, 'access token');
				sinon.assert.calledWith(stubIsExpiredToken, 'refresh token');
				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.calledWith(stubDecodeToken, 'access token');
				sinon.assert.calledOnce(stubCreateAccessToken);
				sinon.assert.calledWith(stubCreateAccessToken, tokenInfo);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubIsExpiredToken.withArgs('access token').returns(false);
			stubIsExpiredToken.withArgs('refresh token').returns(false);
			stubDecodeToken.returns(tokenInfo);
			stubCreateAccessToken.returns('new access token');
			stubGetCache.resolves('refresh token');

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				const result = await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				equal(result, 'new access token');
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If refresh/access token is expired', async function () {
			stubIsExpiredToken.withArgs('access token').returns(true);
			stubIsExpiredToken.withArgs('refresh token').returns(true);
			stubDecodeToken.returns(tokenInfo);
			stubCreateAccessToken.returns('new access token');
			stubGetCache.resolves('refresh token');

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.notCalled(stubDecodeToken);
				sinon.assert.notCalled(stubCreateAccessToken);
			}
		});

		it('If access token is expired', async function () {
			stubIsExpiredToken.withArgs('access token').returns(true);
			stubIsExpiredToken.withArgs('refresh token').returns(false);
			stubDecodeToken.returns(tokenInfo);
			stubCreateAccessToken.returns('new access token');
			stubGetCache.resolves('refresh token');

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.calledOnce(stubCreateAccessToken);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If refresh token is expired', async function () {
			stubIsExpiredToken.withArgs('access token').returns(false);
			stubIsExpiredToken.withArgs('refresh token').returns(true);
			stubDecodeToken.returns(tokenInfo);
			stubCreateAccessToken.returns('new access token');
			stubGetCache.resolves('refresh token');

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.notCalled(stubCreateAccessToken);
			}
		});

		it("If access token is ''", async function () {
			stubIsExpiredToken.withArgs('').returns(false);
			stubIsExpiredToken.withArgs('refresh token').returns(false);
			stubDecodeToken.returns(tokenInfo);
			stubCreateAccessToken.returns('new access token');
			stubGetCache.resolves('refresh token');

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: '',
					refreshToken: 'refresh token',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.notCalled(stubDecodeToken);
				sinon.assert.notCalled(stubCreateAccessToken);
			}
		});

		it('If decodedData is null', async function () {
			stubIsExpiredToken.withArgs('access token').returns(false);
			stubIsExpiredToken.withArgs('refresh token').returns(false);
			stubDecodeToken.returns(null);
			stubCreateAccessToken.returns('new access token');
			stubGetCache.resolves('refresh token');

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.notCalled(stubCreateAccessToken);
			}
		});

		it('If getCache is null', async function () {
			stubIsExpiredToken.withArgs('access token').returns(false);
			stubIsExpiredToken.withArgs('refresh token').returns(false);
			stubDecodeToken.returns(null);
			stubCreateAccessToken.returns('new access token');
			stubGetCache.resolves(null);

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.notCalled(stubCreateAccessToken);
			}
		});

		it('If cachedToken is different with refreshToken', async function () {
			stubIsExpiredToken.withArgs('access token').returns(false);
			stubIsExpiredToken.withArgs('refresh token').returns(false);
			stubDecodeToken.returns(tokenInfo);
			stubGetCache.resolves('refresh token2');
			stubCreateAccessToken.returns('new access token');

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.notCalled(stubCreateAccessToken);
			}
		});

		it('If createAccessToken error', async function () {
			stubIsExpiredToken.withArgs('access token').returns(false);
			stubIsExpiredToken.withArgs('refresh token').returns(false);
			stubDecodeToken.returns(tokenInfo);
			stubGetCache.resolves('refresh token');
			stubCreateAccessToken.throws(new Error('createAccessToken error'));

			const injectedFunc = refreshToken({
				...common,
				cacheUtil: { deleteCache: cacheUtil.deleteCache, ...customCacheUtil },
				jwtUtil: {
					...customJwtUtil,
				},
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledTwice(stubIsExpiredToken);
				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.calledOnce(stubCreateAccessToken);
			}
		});
	});

	describe('#deleteToken', function () {
		const customJwtUtil = { decodeToken };
		const customCacheUtil = { getCache, deleteCache };
		let stubDecodeToken = sinon.stub(customJwtUtil, 'decodeToken');
		let stubGetCache = sinon.stub(customCacheUtil, 'getCache');
		let stubDeleteCache = sinon.stub(customCacheUtil, 'deleteCache');
		const tokenInfo = {
			email: 'test@naver.com',
			nickname: 'test',
		};

		beforeEach(function () {
			stubDecodeToken = sinon.stub(customJwtUtil, 'decodeToken');
			stubGetCache = sinon.stub(customCacheUtil, 'getCache');
			stubDeleteCache = sinon.stub(customCacheUtil, 'deleteCache');
		});

		it('Check function parameters', async function () {
			stubDecodeToken.returns(tokenInfo);
			stubGetCache.resolves('refresh token');
			stubDeleteCache.resolves();

			const injectedFunc = deleteToken({
				...common,
				cacheUtil: { ...customCacheUtil },
				jwtUtil: { ...customJwtUtil },
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				sinon.assert.calledWith(stubDecodeToken, 'access token');
				sinon.assert.calledWith(stubGetCache, tokenInfo.email);
				sinon.assert.calledWith(stubDeleteCache, tokenInfo.email);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubDecodeToken.returns(tokenInfo);
			stubGetCache.resolves('refresh token');
			stubDeleteCache.resolves();

			const injectedFunc = deleteToken({
				...common,
				cacheUtil: { ...customCacheUtil },
				jwtUtil: { ...customJwtUtil },
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubDeleteCache);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If decodedData return null', async function () {
			stubDecodeToken.returns(null);
			stubGetCache.resolves('refresh token');
			stubDeleteCache.resolves();

			const injectedFunc = deleteToken({
				...common,
				cacheUtil: { ...customCacheUtil },
				jwtUtil: { ...customJwtUtil },
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.notCalled(stubGetCache);
				sinon.assert.notCalled(stubDeleteCache);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If cachedRefreshToken is different with refreshToken', async function () {
			stubDecodeToken.returns(tokenInfo);
			stubGetCache.resolves('refresh token2');
			stubDeleteCache.resolves();

			const injectedFunc = deleteToken({
				...common,
				cacheUtil: { ...customCacheUtil },
				jwtUtil: { ...customJwtUtil },
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.notCalled(stubDeleteCache);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If deleteCache error', async function () {
			stubDecodeToken.returns(tokenInfo);
			stubGetCache.resolves('refresh token');
			stubDeleteCache.rejects(new Error('deleteCache error'));

			const injectedFunc = deleteToken({
				...common,
				cacheUtil: { ...customCacheUtil },
				jwtUtil: { ...customJwtUtil },
			});

			try {
				await injectedFunc({
					accessToken: 'access token',
					refreshToken: 'refresh token',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubDecodeToken);
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubDeleteCache);
			}
		});
	});

	describe('#resendVerificationEmail', function () {
		const service = { sendVerificationEmail };
		const repository = { findUserPrivacy };
		let stubSendVerificationEmail = sinon.stub(service, 'sendVerificationEmail');
		let stubFindUserPrivacy = sinon.stub(repository, 'findUserPrivacy');
		const defaultInfo = {
			userEmail: 'test@naver.com',
			userNickname: 'test',
		};

		beforeEach(function () {
			stubSendVerificationEmail = sinon.stub(service, 'sendVerificationEmail');
			stubFindUserPrivacy = sinon.stub(repository, 'findUserPrivacy');
		});

		it('Check function parameters', async function () {
			const privacy = new UserPrivacyModel({
				isAuthenticated: false,
				isGroupInvitationOn: true,
				isPublicUser: true,
				userEmail: defaultInfo.userEmail,
			});

			stubFindUserPrivacy.resolves(privacy);
			stubSendVerificationEmail.resolves(true);

			const injectedFunc = resendVerificationEmail({
				...common,
				repository,
				service,
			});

			try {
				await injectedFunc(defaultInfo);

				sinon.assert.calledWith(stubFindUserPrivacy, {
					userEmail: defaultInfo.userEmail,
				});
				sinon.assert.calledWith(stubSendVerificationEmail, defaultInfo);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			const privacy = new UserPrivacyModel({
				isAuthenticated: false,
				isGroupInvitationOn: true,
				isPublicUser: true,
				userEmail: defaultInfo.userEmail,
			});

			stubFindUserPrivacy.resolves(privacy);
			stubSendVerificationEmail.resolves(true);

			const injectedFunc = resendVerificationEmail({
				...common,
				repository,
				service,
			});

			try {
				const result = await injectedFunc(defaultInfo);

				equal(result.code, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If sendVerificationEmail return false', async function () {
			const privacy = new UserPrivacyModel({
				isAuthenticated: false,
				isGroupInvitationOn: true,
				isPublicUser: true,
				userEmail: defaultInfo.userEmail,
			});

			stubFindUserPrivacy.resolves(privacy);
			stubSendVerificationEmail.resolves(false);

			const injectedFunc = resendVerificationEmail({
				...common,
				repository,
				service,
			});

			try {
				const result = await injectedFunc(defaultInfo);

				equal(result.code, 0);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If isAuthenticated privacy is true', async function () {
			const privacy = new UserPrivacyModel({
				isAuthenticated: true,
				isGroupInvitationOn: true,
				isPublicUser: true,
				userEmail: defaultInfo.userEmail,
			});

			stubFindUserPrivacy.resolves(privacy);
			stubSendVerificationEmail.resolves(true);

			const injectedFunc = resendVerificationEmail({
				...common,
				repository,
				service,
			});

			try {
				await injectedFunc(defaultInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindUserPrivacy);
				sinon.assert.notCalled(stubSendVerificationEmail);
			}
		});

		it('If findUserPrivacy return null', async function () {
			stubFindUserPrivacy.resolves(null);
			stubSendVerificationEmail.resolves(true);

			const injectedFunc = resendVerificationEmail({
				...common,
				repository,
				service,
			});

			try {
				await injectedFunc(defaultInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindUserPrivacy);
				sinon.assert.notCalled(stubSendVerificationEmail);
			}
		});

		it('If findUserPrivacy error', async function () {
			stubFindUserPrivacy.rejects(new Error('findUserPrivacy error'));
			stubSendVerificationEmail.resolves(true);

			const injectedFunc = resendVerificationEmail({
				...common,
				repository,
				service,
			});

			try {
				await injectedFunc(defaultInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindUserPrivacy);
				sinon.assert.notCalled(stubSendVerificationEmail);
			}
		});

		it('If sendVerificationEmail error', async function () {
			const privacy = new UserPrivacyModel({
				isAuthenticated: false,
				isGroupInvitationOn: true,
				isPublicUser: true,
				userEmail: defaultInfo.userEmail,
			});

			stubFindUserPrivacy.resolves(privacy);
			stubSendVerificationEmail.rejects(new Error('sendVerificationEmail error'));

			const injectedFunc = resendVerificationEmail({
				...common,
				repository,
				service,
			});

			try {
				await injectedFunc(defaultInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindUserPrivacy);
				sinon.assert.calledOnce(stubSendVerificationEmail);
			}
		});
	});

	describe('#verifyEmail', function () {
		const repository = { updateUserPrivacy };
		const customCacheUtil = {
			getCache: getEmailVerificationStateCache,
			deleteCache: cacheUtil.deleteCache,
		};
		let stubUpdateUserPrivacy = sinon.stub(repository, 'updateUserPrivacy');
		let stubGetCache = sinon.stub(customCacheUtil, 'getCache');
		const defaultInfo = { userEmail: 'test@naver.com', emailState: 'randomState1' };

		beforeEach(function () {
			stubUpdateUserPrivacy = sinon.stub(repository, 'updateUserPrivacy');
			stubGetCache = sinon.stub(customCacheUtil, 'getCache');
		});

		it('Check function parameters', async function () {
			stubUpdateUserPrivacy.resolves();
			stubGetCache.resolves(defaultInfo.emailState);

			const injectedFunc = verifyEmail({
				...common,
				repository,
				cacheUtil: customCacheUtil,
			});

			try {
				await injectedFunc(defaultInfo);

				sinon.assert.calledWith(stubGetCache, defaultInfo.userEmail);
				sinon.assert.calledWith(stubUpdateUserPrivacy, {
					userEmail: defaultInfo.userEmail,
					isAuthenticated: true,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubUpdateUserPrivacy.resolves();
			stubGetCache.resolves(defaultInfo.emailState);

			const injectedFunc = verifyEmail({
				...common,
				repository,
				cacheUtil: customCacheUtil,
			});

			try {
				const result = await injectedFunc(defaultInfo);

				equal(result.code, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If getCache return null', async function () {
			stubUpdateUserPrivacy.resolves();
			stubGetCache.resolves(null);

			const injectedFunc = verifyEmail({
				...common,
				repository,
				cacheUtil: customCacheUtil,
			});

			try {
				const result = await injectedFunc(defaultInfo);

				deepStrictEqual(result, { code: 2 });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If decoded data !== emailState', async function () {
			stubUpdateUserPrivacy.resolves();
			stubGetCache.resolves('notSameData');

			const injectedFunc = verifyEmail({
				...common,
				repository,
				cacheUtil: customCacheUtil,
			});

			try {
				const result = await injectedFunc(defaultInfo);

				deepStrictEqual(result, { code: 3 });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If getCache error', async function () {
			stubUpdateUserPrivacy.resolves();
			stubGetCache.rejects(new Error('getCache error'));

			const injectedFunc = verifyEmail({
				...common,
				repository,
				cacheUtil: customCacheUtil,
			});

			try {
				await injectedFunc(defaultInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.notCalled(stubUpdateUserPrivacy);
			}
		});

		it('If updateUserPrivacy error', async function () {
			stubUpdateUserPrivacy.rejects(new Error('updateUserPrivacy error'));
			stubGetCache.resolves(defaultInfo.emailState);

			const injectedFunc = verifyEmail({
				...common,
				repository,
				cacheUtil: customCacheUtil,
			});

			try {
				await injectedFunc(defaultInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubUpdateUserPrivacy);
			}
		});
	});
});
