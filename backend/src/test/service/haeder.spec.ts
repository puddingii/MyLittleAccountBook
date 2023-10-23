/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail } from 'assert';
import sinon from 'sinon';
import { Transaction, TransactionOptions } from 'sequelize';

/** Service */
import { createAccountBookAndInviteUser } from '@/service/headerService';

/** Dependency */
import { errorUtil } from '../commonDependency';
import sequelize from '@/loader/mysql';
import { createAccountBook } from '@/repository/accountBookRepository/dependency';
import { createDefaultCategory } from '@/repository/categoryRepository/dependency';
import { createGroupList } from '@/repository/groupRepository/dependency';

/** Model */
import AccountBookModel from '@/model/accountBook';
import GroupModel from '@/model/group';

describe('Header Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};
	const database = { sequelize };
	let stubTransaction: sinon.SinonStub<
		[options?: TransactionOptions | undefined],
		Promise<Transaction>
	>;

	beforeEach(function () {
		stubTransaction = sinon.stub(database.sequelize, 'transaction');
		stubTransaction.callsFake(function () {
			return Promise.resolve({
				commit: () => Promise.resolve(),
				rollback: () => Promise.resolve(),
				afterCommit: () => Promise.resolve(),
				LOCK: 'SHARE' as unknown,
			}) as Promise<Transaction>;
		});
	});

	describe('#createAccountBookAndInviteUser', function () {
		const repository = { createAccountBook, createDefaultCategory, createGroupList };
		const accountBookInfo = {
			title: '가계부 이름',
			content: '가계부 설명',
		};
		const invitedUserList: Array<{ email: string; type: GroupModel['userType'] }> = [
			{ email: 'test2@naver.com', type: 'manager' as const },
			{ email: 'test3@naver.com', type: 'writer' as const },
			{ email: 'test4@naver.com', type: 'observer' as const },
		];
		let stubCreateAccountBook = sinon.stub(repository, 'createAccountBook');
		let stubCreateDefaultCategory = sinon.stub(repository, 'createDefaultCategory');
		let stubCreateGroupList = sinon.stub(repository, 'createGroupList');

		beforeEach(function () {
			stubCreateAccountBook = sinon.stub(repository, 'createAccountBook');
			stubCreateDefaultCategory = sinon.stub(repository, 'createDefaultCategory');
			stubCreateGroupList = sinon.stub(repository, 'createGroupList');
		});

		it('Check function parameters', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.resolves();

			const injectedFunc = createAccountBookAndInviteUser({
				...common,
				...database,
				repository,
			});

			try {
				await injectedFunc({
					...accountBookInfo,
					invitedUserList,
					ownerEmail: 'test@naver.com',
				});

				sinon.assert.calledWith(stubCreateAccountBook, accountBookInfo);
				sinon.assert.calledWith(stubCreateDefaultCategory, 1);
				sinon.assert.calledWith(stubCreateGroupList, [
					{
						userEmail: 'test2@naver.com',
						userType: 'manager' as const,
						accountBookId: 1,
					},
					{ userEmail: 'test3@naver.com', userType: 'writer' as const, accountBookId: 1 },
					{
						userEmail: 'test4@naver.com',
						userType: 'observer' as const,
						accountBookId: 1,
					},
					{ userEmail: 'test@naver.com', userType: 'owner' as const, accountBookId: 1 },
				]);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.resolves();

			const injectedFunc = createAccountBookAndInviteUser({
				...common,
				...database,
				repository,
			});

			try {
				const result = await injectedFunc({
					...accountBookInfo,
					invitedUserList,
					ownerEmail: 'test@naver.com',
				});

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If invitedUserList include owner usertype', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.resolves();
			const invitedUserListIncludeOnwer = [...invitedUserList];
			invitedUserListIncludeOnwer.push({ email: 'test5@naver.com', type: 'owner' });

			const injectedFunc = createAccountBookAndInviteUser({
				...common,
				...database,
				repository,
			});

			try {
				await injectedFunc({
					...accountBookInfo,
					invitedUserList: invitedUserListIncludeOnwer,
					ownerEmail: 'test@naver.com',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCreateAccountBook);
				sinon.assert.calledOnce(stubCreateDefaultCategory);
				sinon.assert.neverCalledWith(stubCreateGroupList);
			}
		});

		it('If createAccountBook error', async function () {
			stubCreateAccountBook.rejects(new Error('createAccountBook error'));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.resolves();

			const injectedFunc = createAccountBookAndInviteUser({
				...common,
				...database,
				repository,
			});

			try {
				await injectedFunc({
					...accountBookInfo,
					invitedUserList,
					ownerEmail: 'test@naver.com',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCreateAccountBook);
				sinon.assert.neverCalledWith(stubCreateDefaultCategory);
				sinon.assert.neverCalledWith(stubCreateGroupList);
			}
		});

		it('If createDefaultCategory error', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.rejects(new Error('createDefaultCategory error'));
			stubCreateGroupList.resolves();

			const injectedFunc = createAccountBookAndInviteUser({
				...common,
				...database,
				repository,
			});

			try {
				await injectedFunc({
					...accountBookInfo,
					invitedUserList,
					ownerEmail: 'test@naver.com',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCreateAccountBook);
				sinon.assert.calledOnce(stubCreateDefaultCategory);
				sinon.assert.neverCalledWith(stubCreateGroupList);
			}
		});

		it('If createGroupList error', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.rejects(new Error('createGroupList error'));

			const injectedFunc = createAccountBookAndInviteUser({
				...common,
				...database,
				repository,
			});

			try {
				await injectedFunc({
					...accountBookInfo,
					invitedUserList,
					ownerEmail: 'test@naver.com',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCreateAccountBook);
				sinon.assert.calledOnce(stubCreateDefaultCategory);
				sinon.assert.calledOnce(stubCreateGroupList);
			}
		});
	});
});
