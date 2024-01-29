/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepStrictEqual, equal, fail } from 'assert';
import sinon from 'sinon';
import { Transaction, TransactionOptions } from 'sequelize';
import dayjs from 'dayjs';

/** Service */
import {
	createAccountBookAndInviteUser,
	createNewNotice,
	deleteNotice,
	getNotice,
	getNoticeList,
	updateNotice,
} from '@/service/headerService';

/** Dependency */
import { errorUtil } from '../commonDependency';
import { createAccountBook } from '@/repository/accountBookRepository/dependency';
import { createDefaultCategory } from '@/repository/categoryRepository/dependency';
import { createGroupList } from '@/repository/groupRepository/dependency';
import { findInviteEnableUserInfoList } from '@/repository/userRepository/dependency';
import {
	findOneNotice,
	findNoticeList,
	createNotice as createNoticeRepo,
	deleteNotice as deleteNoticeRepo,
	updateNotice as updateNoticeRepo,
} from '@/repository/noticeRepository/dependency';

/** Model */
import AccountBookModel from '@/model/accountBook';
import NoticeModel from '@/model/notice';
import GroupModel from '@/model/group';
import UserModel from '@/model/user';
import sequelize from '@/loader/mysql';
import { getCurrentDate } from '@/util/date';

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
		const repository = {
			createAccountBook,
			createDefaultCategory,
			createGroupList,
			findInviteEnableUserInfoList,
		};
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
		let stubFindInviteEnableUserInfoList = sinon.stub(
			repository,
			'findInviteEnableUserInfoList',
		);

		beforeEach(function () {
			stubCreateAccountBook = sinon.stub(repository, 'createAccountBook');
			stubCreateDefaultCategory = sinon.stub(repository, 'createDefaultCategory');
			stubCreateGroupList = sinon.stub(repository, 'createGroupList');
			stubFindInviteEnableUserInfoList = sinon.stub(
				repository,
				'findInviteEnableUserInfoList',
			);
		});

		it('Check function parameters', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.resolves();

			const invitedUserListIncludeOwner = [...invitedUserList];
			invitedUserListIncludeOwner.push({ email: 'test5@naver.com', type: 'owner' });
			stubFindInviteEnableUserInfoList.resolves(
				invitedUserListIncludeOwner.map(
					invitedUser =>
						new UserModel({ email: invitedUser.email, nickname: 'nickname' }),
				),
			);

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
				sinon.assert.calledWith(
					stubFindInviteEnableUserInfoList,
					invitedUserList.map(user => ({ email: user.email })),
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.resolves();
			stubFindInviteEnableUserInfoList.resolves(
				invitedUserList.map(
					invitedUser =>
						new UserModel({ email: invitedUser.email, nickname: 'nickname' }),
				),
			);

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

		it('If createAccountBook error', async function () {
			stubCreateAccountBook.rejects(new Error('createAccountBook error'));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.resolves();
			stubFindInviteEnableUserInfoList.resolves(
				invitedUserList.map(
					invitedUser =>
						new UserModel({ email: invitedUser.email, nickname: 'nickname' }),
				),
			);

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
				sinon.assert.notCalled(stubCreateDefaultCategory);
				sinon.assert.notCalled(stubCreateGroupList);
				sinon.assert.notCalled(stubFindInviteEnableUserInfoList);
			}
		});

		it('If createDefaultCategory error', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.rejects(new Error('createDefaultCategory error'));
			stubCreateGroupList.resolves();
			stubFindInviteEnableUserInfoList.resolves(
				invitedUserList.map(
					invitedUser =>
						new UserModel({ email: invitedUser.email, nickname: 'nickname' }),
				),
			);

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
				sinon.assert.notCalled(stubCreateGroupList);
				sinon.assert.notCalled(stubFindInviteEnableUserInfoList);
			}
		});

		it('If createGroupList error', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.rejects(new Error('createGroupList error'));
			stubFindInviteEnableUserInfoList.resolves(
				invitedUserList.map(
					invitedUser =>
						new UserModel({ email: invitedUser.email, nickname: 'nickname' }),
				),
			);

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
				sinon.assert.calledOnce(stubFindInviteEnableUserInfoList);
			}
		});

		it('If findInviteEnableUserInfoList error', async function () {
			stubCreateAccountBook.resolves(new AccountBookModel({ ...accountBookInfo, id: 1 }));
			stubCreateDefaultCategory.resolves();
			stubCreateGroupList.resolves();
			stubFindInviteEnableUserInfoList.rejects(
				new Error('findInviteEnableUserInfoList error'),
			);

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
				sinon.assert.notCalled(stubCreateGroupList);
				sinon.assert.calledOnce(stubFindInviteEnableUserInfoList);
			}
		});
	});

	describe('Notice', function () {
		const curDate = dayjs('2024-01-01').toDate();
		const noticeInfo = {
			id: 1,
			title: 'title1',
			content: 'content1',
			isUpdateContent: true,
			createdAt: curDate,
			updatedAt: curDate,
		};
		const noticeList = Array.from({ length: 3 }, (_, idx) => ({
			...noticeInfo,
			id: idx,
			isUpdateContent: idx % 2 === 0,
		}));

		describe('#getNotice', function () {
			const repository = {
				findOneNotice,
			};
			let stubFindOneNotice = sinon.stub(repository, 'findOneNotice');

			beforeEach(function () {
				stubFindOneNotice = sinon.stub(repository, 'findOneNotice');
			});

			it('Check function parameters', async function () {
				stubFindOneNotice.resolves(new NoticeModel({ ...noticeInfo }));

				const injectedFunc = getNotice({
					...common,
					repository,
				});

				try {
					await injectedFunc({ id: 1 });

					sinon.assert.calledWith(stubFindOneNotice, { id: 1 });
				} catch (err) {
					fail(err as Error);
				}
			});

			it('Check correct result', async function () {
				stubFindOneNotice.resolves(new NoticeModel({ ...noticeInfo }));

				const injectedFunc = getNotice({
					...common,
					repository,
				});

				try {
					const result = await injectedFunc({ id: 1 });

					deepStrictEqual(result, noticeInfo);
				} catch (err) {
					fail(err as Error);
				}
			});

			it('If findOneNotice error', async function () {
				stubFindOneNotice.rejects(new Error('findOneNotice error'));

				const injectedFunc = getNotice({
					...common,
					repository,
				});

				try {
					await injectedFunc({ id: 1 });

					fail('Expected to error');
				} catch (err) {
					if (err instanceof AssertionError) {
						fail(err);
					}
					sinon.assert.calledOnce(stubFindOneNotice);
				}
			});

			it('If findOneNotice returns null', async function () {
				stubFindOneNotice.resolves(null);

				const injectedFunc = getNotice({
					...common,
					repository,
				});

				try {
					await injectedFunc({ id: 1 });

					fail('Expected to error');
				} catch (err) {
					if (err instanceof AssertionError) {
						fail(err);
					}
					sinon.assert.calledOnce(stubFindOneNotice);
				}
			});
		});

		describe('#getNoticeList', function () {
			const repository = {
				findNoticeList,
			};
			let stubFindNoticeList = sinon.stub(repository, 'findNoticeList');

			beforeEach(function () {
				stubFindNoticeList = sinon.stub(repository, 'findNoticeList');
			});

			it('Check function parameters', async function () {
				stubFindNoticeList.resolves({
					rows: noticeList.map(notice => new NoticeModel(notice)),
					count: 3,
				});

				const injectedFunc = getNoticeList({
					...common,
					repository,
				});

				try {
					await injectedFunc({ page: 1, limit: 10 });

					sinon.assert.calledWith(stubFindNoticeList, { page: 1, limit: 10 });
				} catch (err) {
					fail(err as Error);
				}
			});

			it('Check correct result', async function () {
				stubFindNoticeList.resolves({
					rows: noticeList.map(notice => new NoticeModel(notice)),
					count: 3,
				});

				const injectedFunc = getNoticeList({
					...common,
					repository,
				});

				try {
					const result = await injectedFunc({ page: 1, limit: 10 });

					deepStrictEqual(result, { list: noticeList, count: 3 });
				} catch (err) {
					fail(err as Error);
				}
			});

			it('If findNoticeList error', async function () {
				stubFindNoticeList.rejects(new Error('findNoticeList error'));

				const injectedFunc = getNoticeList({
					...common,
					repository,
				});

				try {
					await injectedFunc({ page: 1, limit: 10 });

					fail('Expected to error');
				} catch (err) {
					if (err instanceof AssertionError) {
						fail(err);
					}
					sinon.assert.calledOnce(stubFindNoticeList);
				}
			});
		});

		describe('#updateNotice', function () {
			const repository = {
				updateNotice: updateNoticeRepo,
			};
			const dateUtil = {
				getCurrentDate,
			};
			let stubUpdateNotice = sinon.stub(repository, 'updateNotice');
			let stubGetCurrentDate = sinon.stub(dateUtil, 'getCurrentDate');

			beforeEach(function () {
				stubUpdateNotice = sinon.stub(repository, 'updateNotice');
				stubGetCurrentDate = sinon.stub(dateUtil, 'getCurrentDate');
			});

			it('Check function parameters', async function () {
				stubUpdateNotice.resolves([1]);
				stubGetCurrentDate.returns(curDate);

				const injectedFunc = updateNotice({
					...common,
					dateUtil,
					repository,
				});

				try {
					await injectedFunc({ id: 1, content: 'fixedContent' });

					sinon.assert.calledWith(stubUpdateNotice, {
						id: 1,
						content: 'fixedContent',
						updatedAt: curDate,
					});
				} catch (err) {
					fail(err as Error);
				}
			});

			it('Check correct result', async function () {
				stubUpdateNotice.resolves([1]);
				stubGetCurrentDate.returns(curDate);

				const injectedFunc = updateNotice({
					...common,
					dateUtil,
					repository,
				});

				try {
					const result = await injectedFunc({ id: 1, content: 'fixedContent' });

					deepStrictEqual(result, { count: [1] });
				} catch (err) {
					fail(err as Error);
				}
			});

			it('If updateNotice error', async function () {
				stubUpdateNotice.rejects(new Error('updateNotice error'));
				stubGetCurrentDate.returns(curDate);

				const injectedFunc = updateNotice({
					...common,
					dateUtil,
					repository,
				});

				try {
					await injectedFunc({ id: 1, content: 'fixedContent' });

					fail('Expected to error');
				} catch (err) {
					if (err instanceof AssertionError) {
						fail(err);
					}
					sinon.assert.calledOnce(stubUpdateNotice);
				}
			});

			it('If getCurrentDate error', async function () {
				stubUpdateNotice.resolves([1]);
				stubGetCurrentDate.throws(new Error('getCurrentDate error'));

				const injectedFunc = updateNotice({
					...common,
					dateUtil,
					repository,
				});

				try {
					await injectedFunc({ id: 1, content: 'fixedContent' });

					fail('Expected to error');
				} catch (err) {
					if (err instanceof AssertionError) {
						fail(err);
					}
					sinon.assert.calledOnce(stubGetCurrentDate);
					sinon.assert.notCalled(stubUpdateNotice);
				}
			});
		});

		describe('#deleteNotice', function () {
			const repository = {
				deleteNotice: deleteNoticeRepo,
			};
			let stubDeleteNotice = sinon.stub(repository, 'deleteNotice');

			beforeEach(function () {
				stubDeleteNotice = sinon.stub(repository, 'deleteNotice');
			});

			it('Check function parameters', async function () {
				stubDeleteNotice.resolves(1);

				const injectedFunc = deleteNotice({
					...common,
					repository,
				});

				try {
					await injectedFunc({ id: 1 });

					sinon.assert.calledWith(stubDeleteNotice, { id: 1 });
				} catch (err) {
					fail(err as Error);
				}
			});

			it('Check correct result', async function () {
				stubDeleteNotice.resolves(1);

				const injectedFunc = deleteNotice({
					...common,
					repository,
				});

				try {
					const result = await injectedFunc({ id: 1 });

					deepStrictEqual(result, { count: 1 });
				} catch (err) {
					fail(err as Error);
				}
			});

			it('If deleteNotice error', async function () {
				stubDeleteNotice.rejects(new Error('deleteNotice error'));

				const injectedFunc = deleteNotice({
					...common,
					repository,
				});

				try {
					await injectedFunc({ id: 1 });

					fail('Expected to error');
				} catch (err) {
					if (err instanceof AssertionError) {
						fail(err);
					}
					sinon.assert.calledOnce(stubDeleteNotice);
				}
			});
		});

		describe('#createNewNotice', function () {
			const repository = {
				createNotice: createNoticeRepo,
			};
			let stubCreateNotice = sinon.stub(repository, 'createNotice');

			beforeEach(function () {
				stubCreateNotice = sinon.stub(repository, 'createNotice');
			});

			it('Check function parameters', async function () {
				stubCreateNotice.resolves(new NoticeModel(noticeInfo));

				const injectedFunc = createNewNotice({
					...common,
					repository,
				});

				try {
					await injectedFunc({
						content: 'content1',
						isUpdateContent: true,
						title: 'title1',
					});

					sinon.assert.calledWith(stubCreateNotice, {
						content: 'content1',
						isUpdateContent: true,
						title: 'title1',
					});
				} catch (err) {
					fail(err as Error);
				}
			});

			it('Check correct result', async function () {
				stubCreateNotice.resolves(new NoticeModel(noticeInfo));

				const injectedFunc = createNewNotice({
					...common,
					repository,
				});

				try {
					const result = await injectedFunc({
						content: 'content1',
						isUpdateContent: true,
						title: 'title1',
					});

					deepStrictEqual(result, {
						id: 1,
						title: 'title1',
						content: 'content1',
						isUpdateContent: true,
						createdAt: curDate,
					});
				} catch (err) {
					fail(err as Error);
				}
			});

			it('If createNotice error', async function () {
				stubCreateNotice.rejects(new Error('createNotice error'));

				const injectedFunc = createNewNotice({
					...common,
					repository,
				});

				try {
					await injectedFunc({
						content: 'content1',
						isUpdateContent: true,
						title: 'title1',
					});

					fail('Expected to error');
				} catch (err) {
					if (err instanceof AssertionError) {
						fail(err);
					}
					sinon.assert.calledOnce(stubCreateNotice);
				}
			});
		});
	});
});
