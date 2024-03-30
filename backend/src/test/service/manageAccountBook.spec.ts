/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepEqual, fail } from 'assert';
import sinon from 'sinon';

/** Service */
import { getAccountBookInfo, updateAccountBookInfo } from '@/service/manageAccountBook';

/** Dependency */
import {
	findOneAccountBookWithImage,
	updateAccountBook,
} from '@/repository/accountBookRepository/dependency';
import { findGroup } from '@/repository/groupRepository/dependency';
import { errorUtil, validationUtil } from '../commonDependency';

/** Model */
import AccountBookModel from '@/model/accountBook';
import GroupModel from '@/model/group';
import AccountBookMediaModel from '@/model/accountBookMedia';

describe('ManageAccountBook Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};

	describe('#getAccountBookInfo', function () {
		const repository = { findGroup, findOneAccountBookWithImage };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubFindOneAccountBookWithImage = sinon.stub(
			repository,
			'findOneAccountBookWithImage',
		);

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubFindOneAccountBookWithImage = sinon.stub(
				repository,
				'findOneAccountBookWithImage',
			);
		});

		it('Check function parameters', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			const medaiInfo = {
				isSaved: true,
				mimeType: 'image/jpeg',
				name: 'testimage',
				path: 'testpath/image',
				size: 10010,
				id: 1,
			};
			stubFindGroup.resolves(new GroupModel());
			const abm = new AccountBookModel(accountBookInfo);
			const image = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: abm.id,
				id: 1,
			});
			abm.accountbookmedias = image;
			stubFindOneAccountBookWithImage.resolves(abm);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com', id: 1, title: '가계부 이름' });

				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubFindOneAccountBookWithImage, {
					id: 1,
					title: '가계부 이름',
				});
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
			const path = 'testpath';
			const medaiInfo = {
				isSaved: true,
				mimeType: 'image/jpeg',
				name: 'testimage',
				path: `${path}/image`,
				size: 10010,
				id: 1,
			};
			const abm = new AccountBookModel(accountBookInfo);
			const image = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: abm.id,
				id: 1,
			});
			abm.accountbookmedias = image;
			stubFindOneAccountBookWithImage.resolves(abm);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				const result = await injectedFunc({ myEmail: 'test@naver.com' });

				deepEqual(result, {
					title: accountBookInfo.title,
					content: accountBookInfo.content,
					imagePath: `image/${path}/${medaiInfo.name}`,
				});
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubFindOneAccountBookWithImage);
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
			const medaiInfo = {
				isSaved: true,
				mimeType: 'image/jpeg',
				name: 'testimage',
				path: 'testpath/image',
				size: 10010,
				id: 1,
			};
			const abm = new AccountBookModel(accountBookInfo);
			const image = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: abm.id,
				id: 1,
			});
			abm.accountbookmedias = image;
			stubFindOneAccountBookWithImage.resolves(abm);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubFindOneAccountBookWithImage);
			}
		});

		it('If findOneAccountBook is null', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubFindOneAccountBookWithImage.resolves(null);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubFindOneAccountBookWithImage);
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
				sinon.assert.notCalled(stubUpdateAccountBook);
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
				sinon.assert.notCalled(stubUpdateAccountBook);
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
