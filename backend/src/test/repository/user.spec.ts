/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepStrictEqual, equal, fail } from 'assert';
import sinon from 'sinon';
import { FindOptions, Model, UpdateOptions } from 'sequelize';

/** Repository */
import { findUserInfo, updateUserInfo } from '@/repository/userRepository';

/** Dependency */
import { errorUtil } from '../commonDependency';

/** Model */
import OAuthUserModel from '@/model/oauthUser';
import UserModel from '@/model/user';

describe('Category Repository Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};

	describe('#findUserInfo', function () {
		let spyFindOne: sinon.SinonSpy<
			[options?: FindOptions<any> | undefined],
			Promise<Model<any, any> | null>
		>;

		let stubFindOne: sinon.SinonStub<
			[options?: FindOptions<any> | undefined],
			Promise<Model<any, any> | null>
		>;

		it('Check function parameters', async function () {
			spyFindOne = sinon.spy(UserModel, 'findOne');

			const injectedFunc = findUserInfo({
				...common,
				OAuthUserModel,
				UserModel,
			});

			try {
				const info = { email: 'test1@naver.com' };
				await injectedFunc(info);

				sinon.assert.calledOnce(spyFindOne);
				sinon.assert.calledWith(spyFindOne, {
					where: info,
					include: { model: OAuthUserModel, as: 'oauthusers' },
					subQuery: false,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyFindOne = sinon.spy(UserModel, 'findOne');

			const injectedFunc = findUserInfo({
				...common,
				OAuthUserModel,
				UserModel,
			});

			try {
				const emailUserInfo = { email: 'test1@naver.com' };
				const emailUserResult = await injectedFunc(emailUserInfo);

				equal(!!emailUserResult?.password, true);
				deepStrictEqual(emailUserResult?.oauthusers, []);

				const socialUserInfo = { email: 'test0@naver.com' };
				const socialUserResult = await injectedFunc(socialUserInfo);

				equal(!!socialUserResult?.password, false);
				equal(socialUserResult?.oauthusers?.length, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If user is not found', async function () {
			spyFindOne = sinon.spy(UserModel, 'findOne');

			const injectedFunc = findUserInfo({
				...common,
				OAuthUserModel,
				UserModel,
			});

			try {
				const userInfo = { email: 'testadsf@naver.com' };
				const result = await injectedFunc(userInfo);

				equal(result, null);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findOne error', async function () {
			stubFindOne = sinon.stub(UserModel, 'findOne');
			stubFindOne.rejects(new Error('findOne error'));

			const injectedFunc = findUserInfo({
				...common,
				OAuthUserModel,
				UserModel,
			});

			try {
				await injectedFunc({ email: 'test1@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindOne);
			}
		});
	});

	describe('#updateUserInfo', function () {
		let spyUpdate: sinon.SinonSpy<
			[
				values: {
					[x: string]: any;
				},
				options: UpdateOptions<any>,
			],
			Promise<[affectedCount: number]>
		>;

		let stubUpdate: sinon.SinonStub<
			[
				values: {
					[x: string]: any;
				},
				options: UpdateOptions<any>,
			],
			Promise<[affectedCount: number]>
		>;

		it('Check function parameters', async function () {
			spyUpdate = sinon.spy(UserModel, 'update');

			const injectedFunc = updateUserInfo({
				...common,
				UserModel,
			});

			try {
				const info = { email: 'test1@naver.com', nickname: 'update' };
				await injectedFunc(info);

				sinon.assert.calledOnce(spyUpdate);
				sinon.assert.calledWith(
					spyUpdate,
					{ nickname: info.nickname },
					{
						where: { email: info.email },
					},
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyUpdate = sinon.spy(UserModel, 'update');

			const injectedFunc = updateUserInfo({
				...common,
				UserModel,
			});

			try {
				const userInfo = { email: 'test2@naver.com', nickname: 'update' };
				const result = await injectedFunc(userInfo);

				if (result[0] === 0 || result[0] > 1) {
					fail('Expected to error');
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If user is not found', async function () {
			spyUpdate = sinon.spy(UserModel, 'update');

			const injectedFunc = updateUserInfo({
				...common,
				UserModel,
			});

			try {
				const userInfo = { email: 'testadsf@naver.com', nickname: 'update' };
				const result = await injectedFunc(userInfo);

				if (result[0] > 0) {
					fail('Expected to error');
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If update error', async function () {
			stubUpdate = sinon.stub(UserModel, 'update');
			stubUpdate.rejects(new Error('update error'));

			const injectedFunc = updateUserInfo({
				...common,
				UserModel,
			});

			try {
				await injectedFunc({ email: 'test1@naver.com', nickname: 'update' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubUpdate);
			}
		});
	});
});
