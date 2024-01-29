/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import sinon from 'sinon';
import nodemailer from 'nodemailer';

/** Service */
import { checkAdminGroupUser, sendVerificationEmail } from '@/service/common/user';

/** Dependency */
import { validationUtil } from '../commonDependency';
import { findGroup } from '@/repository/groupRepository/dependency';

/** Model */
import GroupModel from '@/model/group';

/** Util */
import { getBuilder } from '@/util/mail';
import { getVerifyMailHTML } from '@/util/mail/html';
import {
	getEmailVerificationStateCache,
	setEmailVerificationStateCache,
} from '@/util/cache/v2';
import Mailer from '@/util/mail/class';

describe('Common AccountBook Service Test', function () {
	const { isAdminUserFalse, isAdminUserTrue } = validationUtil;

	describe('#checkAdminGroupUser', function () {
		const repository = { findGroup };
		let stubFindGroup = sinon.stub(repository, 'findGroup');

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
		});

		it('Check function parameters', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			stubFindGroup.resolves(group);

			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});

				sinon.assert.calledWith(stubFindGroup, {
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			stubFindGroup.resolves(group);

			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserTrue },
				repository,
			});

			try {
				const result = await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});

				equal(result, group);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If user is not admin user', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			stubFindGroup.resolves(group);

			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserFalse },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});

				fail('Result is expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});

		it('If groupInfo is null', async function () {
			stubFindGroup.resolves(null);

			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});

				fail('Result is expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});
	});

	describe('#sendVerificationEmail', function () {
		const userInfo = {
			userNickname: 'test',
			userEmail: 'test@naver.com',
		};
		const mailUtil = { getBuilder, getVerifyMailHTML };
		const cacheUtil = {
			setCache: setEmailVerificationStateCache,
			getCache: getEmailVerificationStateCache,
		};
		const builder = getBuilder();
		const mailer = new Mailer(
			nodemailer.createTransport({
				port: 587,
				host: '',
				auth: { user: '', pass: '' },
			}),
			{},
		);

		let stubSendMail = sinon.stub(mailer, 'sendMail');
		let stubBuilderBuild = sinon.stub(builder, 'build');
		let stubGetBuilder = sinon.stub(mailUtil, 'getBuilder');
		let stubGetVerifyMailHTML = sinon.stub(mailUtil, 'getVerifyMailHTML');
		let stubSetCache = sinon.stub(cacheUtil, 'setCache');
		let stubGetCache = sinon.stub(cacheUtil, 'getCache');

		beforeEach(function () {
			stubSendMail = sinon.stub(mailer, 'sendMail');
			stubBuilderBuild = sinon.stub(builder, 'build');
			stubGetBuilder = sinon.stub(mailUtil, 'getBuilder');
			stubGetVerifyMailHTML = sinon.stub(mailUtil, 'getVerifyMailHTML');
			stubSetCache = sinon.stub(cacheUtil, 'setCache');
			stubGetCache = sinon.stub(cacheUtil, 'getCache');
		});

		it('Check function parameters', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.resolves();
			stubGetCache.resolves('3');

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				await injectedFunc(userInfo);

				sinon.assert.calledWith(stubGetCache, userInfo.userEmail);
				sinon.assert.calledWith(stubSetCache, userInfo.userEmail);
				sinon.assert.calledOnce(stubGetBuilder);
				sinon.assert.calledOnce(stubGetVerifyMailHTML);
				sinon.assert.calledOnce(stubBuilderBuild);
				sinon.assert.calledOnce(stubSendMail);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.resolves();
			stubGetCache.resolves('3');

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				const result = await injectedFunc(userInfo);

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If cacheData >= 5', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.resolves();
			stubGetCache.resolves('5');

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				const result = await injectedFunc(userInfo);

				equal(result, false);
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.notCalled(stubSetCache);
				sinon.assert.notCalled(stubGetBuilder);
				sinon.assert.notCalled(stubGetVerifyMailHTML);
				sinon.assert.notCalled(stubBuilderBuild);
				sinon.assert.notCalled(stubSendMail);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If cacheData is null', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.resolves();
			stubGetCache.resolves(null);

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				await injectedFunc(userInfo);

				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubSetCache);
				sinon.assert.calledOnce(stubGetBuilder);
				sinon.assert.calledOnce(stubGetVerifyMailHTML);
				sinon.assert.calledOnce(stubBuilderBuild);
				sinon.assert.calledOnce(stubSendMail);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If cacheData is ""', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.resolves();
			stubGetCache.resolves('');

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				await injectedFunc(userInfo);

				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubSetCache);
				sinon.assert.calledOnce(stubGetBuilder);
				sinon.assert.calledOnce(stubGetVerifyMailHTML);
				sinon.assert.calledOnce(stubBuilderBuild);
				sinon.assert.calledOnce(stubSendMail);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If getCache error', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.resolves();
			stubGetCache.rejects(new Error('getCache error'));

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				await injectedFunc(userInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.notCalled(stubSetCache);
				sinon.assert.notCalled(stubGetBuilder);
				sinon.assert.notCalled(stubGetVerifyMailHTML);
				sinon.assert.notCalled(stubBuilderBuild);
				sinon.assert.notCalled(stubSendMail);
			}
		});

		it('If setCache error', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.rejects(new Error('setCache error'));
			stubGetCache.resolves('3');

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				await injectedFunc(userInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubSetCache);
				sinon.assert.notCalled(stubGetBuilder);
				sinon.assert.notCalled(stubGetVerifyMailHTML);
				sinon.assert.notCalled(stubBuilderBuild);
				sinon.assert.notCalled(stubSendMail);
			}
		});

		it("If Builder's build error", async function () {
			stubSendMail.resolves();
			stubBuilderBuild.throws(new Error('Builder build error'));
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.resolves();
			stubGetCache.resolves('3');

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				await injectedFunc(userInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubSetCache);
				sinon.assert.calledOnce(stubGetBuilder);
				sinon.assert.calledOnce(stubGetVerifyMailHTML);
				sinon.assert.calledOnce(stubBuilderBuild);
				sinon.assert.notCalled(stubSendMail);
			}
		});

		it('If getBuilder error', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.throws(new Error('getBuilder error'));
			stubGetVerifyMailHTML.returns('content');
			stubSetCache.resolves();
			stubGetCache.resolves('3');

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				await injectedFunc(userInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubSetCache);
				sinon.assert.calledOnce(stubGetBuilder);
				sinon.assert.notCalled(stubGetVerifyMailHTML);
				sinon.assert.notCalled(stubBuilderBuild);
				sinon.assert.notCalled(stubSendMail);
			}
		});

		it('If getVerifyMailHTML error', async function () {
			stubSendMail.resolves();
			stubBuilderBuild.returns(mailer);
			stubGetBuilder.returns(builder);
			stubGetVerifyMailHTML.throws(new Error('getVerifyMailHTML error'));
			stubSetCache.resolves();
			stubGetCache.resolves('3');

			const injectedFunc = sendVerificationEmail({
				cacheUtil,
				mailUtil,
			});

			try {
				await injectedFunc(userInfo);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.calledOnce(stubSetCache);
				sinon.assert.calledOnce(stubGetBuilder);
				sinon.assert.calledOnce(stubGetVerifyMailHTML);
				sinon.assert.notCalled(stubBuilderBuild);
				sinon.assert.notCalled(stubSendMail);
			}
		});
	});
});
