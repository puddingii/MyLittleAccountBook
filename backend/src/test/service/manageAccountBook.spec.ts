/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail } from 'assert';
import sinon from 'sinon';

/** Service */
import { getAccountBookInfo, updateAccountBookInfo } from '@/service/manageAccountBook';

/** Dependency */
import {
	findOneAccountBook,
	updateAccountBook,
} from '@/repository/accountBookRepository/dependency';
import { findGroup } from '@/repository/groupRepository/dependency';
import { errorUtil, validationUtil } from '../commonDependency';

/** Model */
import AccountBookModel from '@/model/accountBook';
import GroupModel from '@/model/group';

describe('ManageAccountBook Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};

	describe('#getAccountBookInfo', function () {
		const repository = { findGroup, findOneAccountBook };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubFindOneAccountBook = sinon.stub(repository, 'findOneAccountBook');

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubFindOneAccountBook = sinon.stub(repository, 'findOneAccountBook');
		});

		it('Check function parameters', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			stubFindGroup.resolves(new GroupModel());
			stubFindOneAccountBook.resolves(new AccountBookModel(accountBookInfo));

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com', id: 1, title: '가계부 이름' });

				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubFindOneAccountBook, { id: 1, title: '가계부 이름' });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			stubFindGroup.resolves(new GroupModel());
			stubFindOneAccountBook.resolves(new AccountBookModel(accountBookInfo));

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				const result = await injectedFunc({ myEmail: 'test@naver.com' });

				equal(result.title, accountBookInfo.title);
				equal(result.content, accountBookInfo.content);
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubFindOneAccountBook);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup is null', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			stubFindGroup.resolves(null);
			stubFindOneAccountBook.resolves(new AccountBookModel(accountBookInfo));

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubFindOneAccountBook);
			}
		});

		it('If findOneAccountBook is null', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubFindOneAccountBook.resolves(null);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubFindOneAccountBook);
			}
		});
	});

	describe('#updateAccountBookInfo', function () {
		const repository = { findGroup, updateAccountBook };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubUpdateAccountBook = sinon.stub(repository, 'updateAccountBook');

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubUpdateAccountBook = sinon.stub(repository, 'updateAccountBook');
		});

		it('Check function parameters', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			stubFindGroup.resolves(new GroupModel());
			stubUpdateAccountBook.resolves(1);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...accountBookInfo,
				});

				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubUpdateAccountBook, {
					...accountBookInfo,
					accountBookId: 1,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubUpdateAccountBook.resolves(1);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					title: '가계부 이름',
					content: '가계부 설명',
				});

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubUpdateAccountBook);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup is null', async function () {
			stubFindGroup.resolves(null);
			stubUpdateAccountBook.resolves(1);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					title: '가계부 이름',
					content: '가계부 설명',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubUpdateAccountBook);
			}
		});

		it('If isAdminUser is false', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubUpdateAccountBook.resolves(1);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserFalse },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					title: '가계부 이름',
					content: '가계부 설명',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubUpdateAccountBook);
			}
		});

		it('If updateAccountBook is 0', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubUpdateAccountBook.resolves(0);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					title: '가계부 이름',
					content: '가계부 설명',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubUpdateAccountBook);
			}
		});
	});
});
