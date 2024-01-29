/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import sinon from 'sinon';
import { pipe } from '@fxts/core';

/** Service */
import {
	createNewFixedColumn,
	createNewNotFixedColumn,
	deleteFixedColumn,
	deleteNotFixedColumn,
	getDefaultInfo,
	updateFixedColumn,
	updateNotFixedColumn,
} from '@/service/spendingIncomeService';

/** Dependency */
import { errorUtil } from '../commonDependency';
import dateUtil from '@/util/date';
import {
	getFixedColumnList,
	getNotFixedColumnList,
	getCategory,
} from '@/service/common/accountBook/dependency';
import {
	createNewColumn as createNewFColumn,
	deleteColumn as deleteFColumn,
	findGAB as findFixedGAB,
	updateColumn as updateFColumn,
} from '@/repository/cronGroupAccountBookRepository/dependency';
import {
	createNewColumn as createNewNFColumn,
	deleteColumn as deleteNFColumn,
	findGAB as findNotFixedGAB,
	updateColumn as updateNFColumn,
} from '@/repository/groupAccountBookRepository/dependency';
import { findGroup } from '@/repository/groupRepository/dependency';
import { checkAdminGroupUser } from '@/service/common/user/dependency';

/** Model */
import GroupModel from '@/model/group';
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupAccountBookModel from '@/model/groupAccountBook';
import realtimeEvent from '@/pubsub/realtimePubsub';

describe('SpendingIncome Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
		dateUtil,
		eventEmitter: sinon.stub(realtimeEvent),
	};

	describe('#createNewFixedColumn', function () {
		const repository = { createNewFColumn, findGroup };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubCreateNewFColumn = sinon.stub(repository, 'createNewFColumn');
		const defaultGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'owner' as const,
			accountBookId: 1,
			id: 1,
		};
		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			cycleTime: 10,
			cycleType: 'd' as const,
			needToUpdateDate: '2022-02-02',
			type: 'income' as const,
			userEmail: 'test@naver.com',
			value: 100,
			content: '내용',
		};

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubCreateNewFColumn = sinon.stub(repository, 'createNewFColumn');
		});

		it('Check owner user and correct value is passed to function', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo }));
			stubCreateNewFColumn.resolves(
				new CronGroupAccountBookModel({
					...defaultColumnInfo,
					needToUpdateDate: dateUtil.toDate(defaultColumnInfo.needToUpdateDate),
					id: 1,
				}),
			);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({
					...defaultColumnInfo,
					userNickname: 'test',
				});

				sinon.assert.calledWith(stubFindGroup, {
					accountBookId: defaultColumnInfo.accountBookId,
					userEmail: defaultColumnInfo.userEmail,
				});
				sinon.assert.calledWith(stubCreateNewFColumn, {
					categoryId: defaultColumnInfo.categoryId,
					content: defaultColumnInfo.content,
					cycleTime: defaultColumnInfo.cycleTime,
					cycleType: defaultColumnInfo.cycleType,
					groupId: defaultGroupInfo.id,
					needToUpdateDate: dateUtil.toDate(defaultColumnInfo.needToUpdateDate),
					type: defaultColumnInfo.type,
					value: defaultColumnInfo.value,
				});

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check manager user', async function () {
			stubFindGroup.resolves(
				new GroupModel({ ...defaultGroupInfo, userType: 'manager' }),
			);
			stubCreateNewFColumn.resolves(
				new CronGroupAccountBookModel({
					...defaultColumnInfo,
					needToUpdateDate: dateUtil.toDate(defaultColumnInfo.needToUpdateDate),
					id: 1,
				}),
			);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateNewFColumn);

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check writer user', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo, userType: 'writer' }));
			stubCreateNewFColumn.resolves(
				new CronGroupAccountBookModel({
					...defaultColumnInfo,
					needToUpdateDate: dateUtil.toDate(defaultColumnInfo.needToUpdateDate),
					id: 1,
				}),
			);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateNewFColumn);

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check observer user', async function () {
			stubFindGroup.resolves(
				new GroupModel({ ...defaultGroupInfo, userType: 'observer' }),
			);
			stubCreateNewFColumn.resolves(
				new CronGroupAccountBookModel({
					...defaultColumnInfo,
					needToUpdateDate: dateUtil.toDate(defaultColumnInfo.needToUpdateDate),
					id: 1,
				}),
			);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				fail('Expected to error that observer type is unauthorized user.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubCreateNewFColumn);
			}
		});

		it('Check not existing group', async function () {
			stubFindGroup.resolves(null);
			stubCreateNewFColumn.resolves(
				new CronGroupAccountBookModel({
					...defaultColumnInfo,
					needToUpdateDate: dateUtil.toDate(defaultColumnInfo.needToUpdateDate),
					id: 1,
				}),
			);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubCreateNewFColumn);
			}
		});

		it('If findGroup is error', async function () {
			stubFindGroup.rejects(new Error('findGroup error'));
			stubCreateNewFColumn.resolves(
				new CronGroupAccountBookModel({
					...defaultColumnInfo,
					needToUpdateDate: dateUtil.toDate(defaultColumnInfo.needToUpdateDate),
					id: 1,
				}),
			);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubCreateNewFColumn);
			}
		});

		it('If createNewFColumn is error', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo }));
			stubCreateNewFColumn.rejects(new Error('findGroup error'));

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateNewFColumn);
			}
		});
	});

	describe('#createNewNotFixedColumn', function () {
		const repository = { createNewNFColumn, findGroup };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubCreateNewNFColumn = sinon.stub(repository, 'createNewNFColumn');
		const defaultGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'owner' as const,
			accountBookId: 1,
			id: 1,
		};
		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			spendingAndIncomeDate: '2022-02-02',
			type: 'income' as const,
			userEmail: 'test@naver.com',
			value: 100,
			content: '내용',
		};

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubCreateNewNFColumn = sinon.stub(repository, 'createNewNFColumn');
		});

		it('Check owner user and correct value is passed to function', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo }));
			stubCreateNewNFColumn.resolves(
				new GroupAccountBookModel({
					id: 1,
					...defaultColumnInfo,
					spendingAndIncomeDate: dateUtil.toDate(defaultColumnInfo.spendingAndIncomeDate),
				}),
			);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				sinon.assert.calledWith(stubFindGroup, {
					accountBookId: defaultColumnInfo.accountBookId,
					userEmail: defaultColumnInfo.userEmail,
				});
				sinon.assert.calledWith(stubCreateNewNFColumn, {
					categoryId: defaultColumnInfo.categoryId,
					content: defaultColumnInfo.content,
					groupId: defaultGroupInfo.id,
					spendingAndIncomeDate: dateUtil.toDate(defaultColumnInfo.spendingAndIncomeDate),
					type: defaultColumnInfo.type,
					value: defaultColumnInfo.value,
				});

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check manager user', async function () {
			stubFindGroup.resolves(
				new GroupModel({ ...defaultGroupInfo, userType: 'manager' }),
			);
			stubCreateNewNFColumn.resolves(
				new GroupAccountBookModel({
					id: 1,
					...defaultColumnInfo,
					spendingAndIncomeDate: dateUtil.toDate(defaultColumnInfo.spendingAndIncomeDate),
				}),
			);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateNewNFColumn);

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check writer user', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo, userType: 'writer' }));
			stubCreateNewNFColumn.resolves(
				new GroupAccountBookModel({
					id: 1,
					...defaultColumnInfo,
					spendingAndIncomeDate: dateUtil.toDate(defaultColumnInfo.spendingAndIncomeDate),
				}),
			);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateNewNFColumn);

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check observer user', async function () {
			stubFindGroup.resolves(
				new GroupModel({ ...defaultGroupInfo, userType: 'observer' }),
			);
			stubCreateNewNFColumn.resolves(
				new GroupAccountBookModel({
					id: 1,
					...defaultColumnInfo,
					spendingAndIncomeDate: dateUtil.toDate(defaultColumnInfo.spendingAndIncomeDate),
				}),
			);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				fail('Expected to error that observer type is unauthorized user.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubCreateNewNFColumn);
			}
		});

		it('Check not existing group', async function () {
			stubFindGroup.resolves(null);
			stubCreateNewNFColumn.resolves(
				new GroupAccountBookModel({
					id: 1,
					...defaultColumnInfo,
					spendingAndIncomeDate: dateUtil.toDate(defaultColumnInfo.spendingAndIncomeDate),
				}),
			);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubCreateNewNFColumn);
			}
		});

		it('If findGroup is error', async function () {
			stubFindGroup.rejects(new Error('findGroup error'));
			stubCreateNewNFColumn.resolves(
				new GroupAccountBookModel({
					id: 1,
					...defaultColumnInfo,
					spendingAndIncomeDate: dateUtil.toDate(defaultColumnInfo.spendingAndIncomeDate),
				}),
			);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubCreateNewNFColumn);
			}
		});

		it('If createNewNFColumn is error', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo }));
			stubCreateNewNFColumn.rejects(new Error('findGroup error'));

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo, userNickname: 'test' });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateNewNFColumn);
			}
		});
	});

	describe('#updateFixedColumn', function () {
		const repository = { findFixedGAB, updateFColumn };
		const service = { checkAdminGroupUser };
		let stubFindFixedGAB = sinon.stub(repository, 'findFixedGAB');
		let stubUpdateFColumn = sinon.stub(repository, 'updateFColumn');
		let stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			cycleTime: 10,
			cycleType: 'd' as const,
			needToUpdateDate: dateUtil.getCurrentDate(),
			type: 'income' as const,
			value: 100,
			content: '내용',
		};
		const defaultOwnerGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'writer' as const,
			accountBookId: 1,
		};

		beforeEach(function () {
			stubFindFixedGAB = sinon.stub(repository, 'findFixedGAB');
			stubUpdateFColumn = sinon.stub(repository, 'updateFColumn');
			stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		});

		it('Check function parameters', async function () {
			const cgabJoinGroup = new CronGroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;
			const requestUserInfo = {
				userEmail: 'test2@naver.com',
				userType: 'owner' as const,
				accountBookId: 1,
			};

			stubFindFixedGAB.resolves(cgabJoinGroup);
			stubUpdateFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...requestUserInfo }));

			const injectedFunc = updateFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					id: 1,
					needToUpdateDate: '2022-02-02',
					userEmail: requestUserInfo.userEmail,
				});

				sinon.assert.calledWith(stubFindFixedGAB, { id: 1 }, { isIncludeGroup: true });
				sinon.assert.calledWith(stubUpdateFColumn, cgabJoinGroup, {
					...defaultColumnInfo,
					needToUpdateDate: dateUtil.toDate('2022-02-02'),
				});
				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: requestUserInfo.userEmail,
					accountBookId: cgabJoinGroup.groups.accountBookId,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If column is deleted in the past', async function () {
			stubFindFixedGAB.resolves(undefined);
			stubUpdateFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = updateFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
					needToUpdateDate: '2022-02-02',
				});

				fail('Expected to error, because column is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindFixedGAB);
				sinon.assert.notCalled(stubUpdateFColumn);
				sinon.assert.notCalled(stubCheckAdminGroupUser);
			}
		});

		it("If column's owner is me", async function () {
			const cgabJoinGroup = new CronGroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindFixedGAB.resolves(cgabJoinGroup);
			stubUpdateFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = updateFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
					needToUpdateDate: '2022-02-02',
				});

				sinon.assert.calledOnce(stubFindFixedGAB);
				sinon.assert.calledOnce(stubUpdateFColumn);
				sinon.assert.notCalled(stubCheckAdminGroupUser);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is admin", async function () {
			const cgabJoinGroup = new CronGroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindFixedGAB.resolves(cgabJoinGroup);
			stubUpdateFColumn.resolves();
			stubCheckAdminGroupUser.resolves(
				new GroupModel({
					userEmail: 'test2@naver.com',
					userType: 'manager', // or 'owner'
					accountBookId: 1,
				}),
			);

			const injectedFunc = updateFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
					needToUpdateDate: '2022-02-02',
				});

				sinon.assert.calledOnce(stubFindFixedGAB);
				sinon.assert.calledOnce(stubUpdateFColumn);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is not admin", async function () {
			const cgabJoinGroup = new CronGroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindFixedGAB.resolves(cgabJoinGroup);
			stubUpdateFColumn.resolves();
			stubCheckAdminGroupUser.rejects(new Error('Admin user 아님'));

			const injectedFunc = updateFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
					needToUpdateDate: '2022-02-02',
				});

				fail(
					'Expected to error, because user who is updating column is not authorizated to update',
				);
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindFixedGAB);
				sinon.assert.notCalled(stubUpdateFColumn);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
			}
		});

		it('Database join error ', async function () {
			const cgab = new CronGroupAccountBookModel({ ...defaultColumnInfo });

			stubFindFixedGAB.resolves(cgab);
			stubUpdateFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = updateFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
					needToUpdateDate: '2022-02-02',
				});

				fail(
					'Expected to error, because user who is updating column is not authorizated to update',
				);
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					sinon.assert.calledOnce(stubFindFixedGAB);
					sinon.assert.notCalled(stubUpdateFColumn);
					sinon.assert.notCalled(stubCheckAdminGroupUser);
					return;
				}
				fail(err as Error);
			}
		});
	});

	describe('#updateNotFixedColumn', function () {
		const repository = { findNotFixedGAB, updateNFColumn };
		const service = { checkAdminGroupUser };
		let stubFindNotFixedGAB = sinon.stub(repository, 'findNotFixedGAB');
		let stubUpdateNFColumn = sinon.stub(repository, 'updateNFColumn');
		let stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			spendingAndIncomeDate: dateUtil.getCurrentDate(),
			type: 'income' as const,
			value: 100,
			content: '내용',
		};
		const defaultOwnerGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'writer' as const,
			accountBookId: 1,
		};

		beforeEach(function () {
			stubFindNotFixedGAB = sinon.stub(repository, 'findNotFixedGAB');
			stubUpdateNFColumn = sinon.stub(repository, 'updateNFColumn');
			stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		});

		it('Check function parameters', async function () {
			const gabJoinGroup = new GroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			gabJoinGroup.groups = group;
			const requestUserInfo = {
				userEmail: 'test2@naver.com',
				userType: 'owner' as const,
				accountBookId: 1,
			};

			stubFindNotFixedGAB.resolves(gabJoinGroup);
			stubUpdateNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...requestUserInfo }));

			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					id: 1,
					spendingAndIncomeDate: '2022-02-02',
					userEmail: requestUserInfo.userEmail,
				});

				sinon.assert.calledWith(stubFindNotFixedGAB, { id: 1 }, { isIncludeGroup: true });
				sinon.assert.calledWith(stubUpdateNFColumn, gabJoinGroup, {
					...defaultColumnInfo,
					spendingAndIncomeDate: dateUtil.toDate('2022-02-02'),
				});
				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: requestUserInfo.userEmail,
					accountBookId: gabJoinGroup.groups.accountBookId,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If column is deleted in the past', async function () {
			stubFindNotFixedGAB.resolves(undefined);
			stubUpdateNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
					spendingAndIncomeDate: '2022-02-02',
				});

				fail('Expected to error, because column is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindNotFixedGAB);
				sinon.assert.notCalled(stubUpdateNFColumn);
				sinon.assert.notCalled(stubCheckAdminGroupUser);
			}
		});

		it("If column's owner is me", async function () {
			const cgabJoinGroup = new GroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindNotFixedGAB.resolves(cgabJoinGroup);
			stubUpdateNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
					spendingAndIncomeDate: '2022-02-02',
				});

				sinon.assert.calledOnce(stubFindNotFixedGAB);
				sinon.assert.calledOnce(stubUpdateNFColumn);
				sinon.assert.notCalled(stubCheckAdminGroupUser);
				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is admin", async function () {
			const cgabJoinGroup = new GroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindNotFixedGAB.resolves(cgabJoinGroup);
			stubUpdateNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(
				new GroupModel({
					userEmail: 'test2@naver.com',
					userType: 'manager', // or 'owner'
					accountBookId: 1,
				}),
			);

			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
					spendingAndIncomeDate: '2022-02-02',
				});

				sinon.assert.calledOnce(stubFindNotFixedGAB);
				sinon.assert.calledOnce(stubUpdateNFColumn);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is not admin", async function () {
			const gabJoinGroup = new GroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			gabJoinGroup.groups = group;

			stubFindNotFixedGAB.resolves(gabJoinGroup);
			stubUpdateNFColumn.resolves();
			stubCheckAdminGroupUser.rejects(new Error('Admin user 아님'));

			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
					spendingAndIncomeDate: '2022-02-02',
				});

				fail(
					'Expected to error, because user who is updating column is not authorizated to update',
				);
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindNotFixedGAB);
				sinon.assert.notCalled(stubUpdateNFColumn);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
			}
		});

		it('Database join error ', async function () {
			const gab = new GroupAccountBookModel({ ...defaultColumnInfo });

			stubFindNotFixedGAB.resolves(gab);
			stubUpdateNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				dateUtil: common.dateUtil,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
					spendingAndIncomeDate: '2022-02-02',
				});

				fail(
					'Expected to error, because user who is updating column is not authorizated to update',
				);
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					sinon.assert.calledOnce(stubFindNotFixedGAB);
					sinon.assert.notCalled(stubUpdateNFColumn);
					sinon.assert.notCalled(stubCheckAdminGroupUser);
					return;
				}
				fail(err as Error);
			}
		});
	});

	describe('#deleteFixedColumn', function () {
		const repository = { findFixedGAB, deleteFColumn };
		const service = { checkAdminGroupUser };
		let stubFindFixedGAB = sinon.stub(repository, 'findFixedGAB');
		let stubDeleteFColumn = sinon.stub(repository, 'deleteFColumn');
		let stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');

		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			cycleTime: 10,
			cycleType: 'd' as const,
			needToUpdateDate: dateUtil.getCurrentDate(),
			type: 'income' as const,
			value: 100,
			content: '내용',
		};
		const defaultOwnerGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'writer' as const,
			accountBookId: 1,
		};

		beforeEach(function () {
			stubFindFixedGAB = sinon.stub(repository, 'findFixedGAB');
			stubDeleteFColumn = sinon.stub(repository, 'deleteFColumn');
			stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		});

		it('Check function parameters', async function () {
			const cgabJoinGroup = new CronGroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;
			const requestUserInfo = {
				userEmail: 'test2@naver.com',
				userType: 'owner' as const,
				accountBookId: 1,
			};

			stubFindFixedGAB.resolves(cgabJoinGroup);
			stubDeleteFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...requestUserInfo }));

			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({ id: 1, userEmail: requestUserInfo.userEmail });

				sinon.assert.calledWith(stubFindFixedGAB, { id: 1 }, { isIncludeGroup: true });
				sinon.assert.calledWith(stubDeleteFColumn, cgabJoinGroup);
				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: requestUserInfo.userEmail,
					accountBookId: cgabJoinGroup.groups.accountBookId,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If column is deleted in the past', async function () {
			stubFindFixedGAB.resolves(undefined);
			stubDeleteFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
				});

				fail('Expected to error, because column is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindFixedGAB);
				sinon.assert.notCalled(stubDeleteFColumn);
				sinon.assert.notCalled(stubCheckAdminGroupUser);
			}
		});

		it("If column's owner is me", async function () {
			const cgabJoinGroup = new CronGroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindFixedGAB.resolves(cgabJoinGroup);
			stubDeleteFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
				});

				sinon.assert.calledOnce(stubFindFixedGAB);
				sinon.assert.calledOnce(stubDeleteFColumn);
				sinon.assert.notCalled(stubCheckAdminGroupUser);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is admin", async function () {
			const cgabJoinGroup = new CronGroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindFixedGAB.resolves(cgabJoinGroup);
			stubDeleteFColumn.resolves();
			stubCheckAdminGroupUser.resolves(
				new GroupModel({
					userEmail: 'test2@naver.com',
					userType: 'manager', // or 'owner'
					accountBookId: 1,
				}),
			);

			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
				});

				sinon.assert.calledOnce(stubFindFixedGAB);
				sinon.assert.calledOnce(stubDeleteFColumn);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is not admin", async function () {
			const cgabJoinGroup = new CronGroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindFixedGAB.resolves(cgabJoinGroup);
			stubDeleteFColumn.resolves();
			stubCheckAdminGroupUser.rejects(new Error('Admin user 아님'));

			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
				});

				fail(
					'Expected to error, because user who is updating column is not authorizated to update',
				);
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindFixedGAB);
				sinon.assert.notCalled(stubDeleteFColumn);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
			}
		});

		it('Database join error ', async function () {
			const cgab = new CronGroupAccountBookModel({ ...defaultColumnInfo });

			stubFindFixedGAB.resolves(cgab);
			stubDeleteFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
				});

				fail(
					'Expected to error, because user who is updating column is not authorizated to update',
				);
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					sinon.assert.calledOnce(stubFindFixedGAB);
					sinon.assert.notCalled(stubDeleteFColumn);
					sinon.assert.notCalled(stubCheckAdminGroupUser);
					return;
				}
				fail(err as Error);
			}
		});
	});

	describe('#deleteNotFixedColumn', function () {
		const repository = { findNotFixedGAB, deleteNFColumn };
		const service = { checkAdminGroupUser };
		let stubFindNotFixedGAB = sinon.stub(repository, 'findNotFixedGAB');
		let stubDeleteNFColumn = sinon.stub(repository, 'deleteNFColumn');
		let stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');

		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			spendingAndIncomeDate: dateUtil.getCurrentDate(),
			type: 'income' as const,
			value: 100,
			content: '내용',
		};
		const defaultOwnerGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'writer' as const,
			accountBookId: 1,
		};

		beforeEach(function () {
			stubFindNotFixedGAB = sinon.stub(repository, 'findNotFixedGAB');
			stubDeleteNFColumn = sinon.stub(repository, 'deleteNFColumn');
			stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		});

		it('Check function parameters', async function () {
			const gabJoinGroup = new GroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			gabJoinGroup.groups = group;
			const requestUserInfo = {
				userEmail: 'test2@naver.com',
				userType: 'owner' as const,
				accountBookId: 1,
			};

			stubFindNotFixedGAB.resolves(gabJoinGroup);
			stubDeleteNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...requestUserInfo }));

			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					id: 1,
					userEmail: requestUserInfo.userEmail,
				});

				sinon.assert.calledWith(stubFindNotFixedGAB, { id: 1 }, { isIncludeGroup: true });
				sinon.assert.calledWith(stubDeleteNFColumn, gabJoinGroup);
				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: requestUserInfo.userEmail,
					accountBookId: gabJoinGroup.groups.accountBookId,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If column is deleted in the past', async function () {
			stubFindNotFixedGAB.resolves(undefined);
			stubDeleteNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
				});

				fail('Expected to error, because column is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindNotFixedGAB);
				sinon.assert.notCalled(stubDeleteNFColumn);
				sinon.assert.notCalled(stubCheckAdminGroupUser);
			}
		});

		it("If column's owner is me", async function () {
			const cgabJoinGroup = new GroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindNotFixedGAB.resolves(cgabJoinGroup);
			stubDeleteNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
				});

				sinon.assert.calledOnce(stubFindNotFixedGAB);
				sinon.assert.calledOnce(stubDeleteNFColumn);
				sinon.assert.notCalled(stubCheckAdminGroupUser);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is admin", async function () {
			const cgabJoinGroup = new GroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			cgabJoinGroup.groups = group;

			stubFindNotFixedGAB.resolves(cgabJoinGroup);
			stubDeleteNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(
				new GroupModel({
					userEmail: 'test2@naver.com',
					userType: 'manager', // or 'owner'
					accountBookId: 1,
				}),
			);

			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
				});

				sinon.assert.calledOnce(stubFindNotFixedGAB);
				sinon.assert.calledOnce(stubDeleteNFColumn);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is not admin", async function () {
			const gabJoinGroup = new GroupAccountBookModel({ ...defaultColumnInfo });
			const group = new GroupModel({ ...defaultOwnerGroupInfo });
			gabJoinGroup.groups = group;

			stubFindNotFixedGAB.resolves(gabJoinGroup);
			stubDeleteNFColumn.resolves();
			stubCheckAdminGroupUser.rejects(new Error('Admin user 아님')); // user is writer or observer

			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
				});

				fail(
					'Expected to error, because user who is updating column is not authorizated to update',
				);
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindNotFixedGAB);
				sinon.assert.notCalled(stubDeleteNFColumn);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
			}
		});

		it('Database join error ', async function () {
			const gab = new GroupAccountBookModel({ ...defaultColumnInfo });

			stubFindNotFixedGAB.resolves(gab);
			stubDeleteNFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				eventEmitter: common.eventEmitter,
				service,
				repository,
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
				});

				fail(
					'Expected to error, because user who is updating column is not authorizated to update',
				);
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					sinon.assert.calledOnce(stubFindNotFixedGAB);
					sinon.assert.notCalled(stubDeleteNFColumn);
					sinon.assert.notCalled(stubCheckAdminGroupUser);
					return;
				}
				fail(err as Error);
			}
		});
	});

	describe('#getDefaultInfo', function () {
		const curDate = dateUtil.getCurrentDate();
		const nextDate = pipe(
			dateUtil.getCurrentDate(),
			dateUtil.addDate('day', 1),
			dateUtil.toDate,
		);
		const fixedColumnList = [
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식',
				type: 'income' as const,
				cycleType: 'sd' as const,
				cycleTime: 1,
				needToUpdateDate: curDate,
				value: 3,
				content: '',
			},
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식',
				type: 'spending' as const,
				cycleType: 'sd' as const,
				cycleTime: 1,
				needToUpdateDate: curDate,
				value: 3,
				content: '',
			},
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식',
				type: 'income' as const,
				cycleType: 'sd' as const,
				cycleTime: 1,
				needToUpdateDate: nextDate,
				value: 3,
				content: '',
			},
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식',
				type: 'income' as const,
				cycleType: 'sd' as const,
				cycleTime: 1,
				needToUpdateDate: nextDate,
				value: 3,
				content: '',
			},
		];
		const notFixedColumnList = [
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식2',
				type: 'income' as const,
				spendingAndIncomeDate: curDate,
				value: 3,
				content: '',
			},
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식2',
				type: 'spending' as const,
				spendingAndIncomeDate: curDate,
				value: 3,
				content: '',
			},
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식2',
				type: 'spending' as const,
				spendingAndIncomeDate: nextDate,
				value: 3,
				content: '',
			},
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식2',
				type: 'spending' as const,
				spendingAndIncomeDate: nextDate,
				value: 3,
				content: '',
			},
		];
		const parentCategory = [
			{
				parentId: 1,
				childId: 5,
				parentName: '부모',
				categoryNamePath: '부모 > 자식',
				categoryIdPath: '1 > 5',
			},
			{
				parentId: 1,
				childId: 6,
				parentName: '부모',
				categoryNamePath: '부모 > 자식2',
				categoryIdPath: '1 > 6',
			},
		];
		const service = { getCategory, getFixedColumnList, getNotFixedColumnList };
		let stubGetCategory = sinon.stub(service, 'getCategory');
		let stubGetFixedColumnList = sinon.stub(service, 'getFixedColumnList');
		let stubGetNotFixedColumnList = sinon.stub(service, 'getNotFixedColumnList');

		beforeEach(function () {
			stubGetCategory = sinon.stub(service, 'getCategory');
			stubGetFixedColumnList = sinon.stub(service, 'getFixedColumnList');
			stubGetNotFixedColumnList = sinon.stub(service, 'getNotFixedColumnList');
		});

		it('Check function parameters', async function () {
			stubGetCategory.resolves([...parentCategory]);
			stubGetFixedColumnList.resolves(fixedColumnList);
			stubGetNotFixedColumnList.resolves(notFixedColumnList);

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					endDate: '',
					startDate: '',
				});

				stubGetCategory.calledWith(1, { end: 2, start: 2 });
				stubGetFixedColumnList.calledWith({ accountBookId: 1 }, [...parentCategory]);
				stubGetNotFixedColumnList.calledWith(
					{ accountBookId: 1, endDate: '', startDate: '' },
					[...parentCategory],
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubGetCategory.resolves([...parentCategory]);
			stubGetFixedColumnList.resolves(fixedColumnList);
			stubGetNotFixedColumnList.resolves(notFixedColumnList);

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				const result = await injectedFunc({
					accountBookId: 1,
					endDate: '',
					startDate: '',
				});
				const objectToString = (obj: { [key: string]: unknown }): string => {
					return Object.keys(obj).reduce(
						(acc: string, key) => `${acc} ${key}:${obj[key]}`,
						'',
					);
				};

				equal(
					objectToString(result.history.notFixedList[0]),
					objectToString(notFixedColumnList[0]),
				);
				equal(
					objectToString(result.history.fixedList[0]),
					objectToString(fixedColumnList[0]),
				);
				equal(objectToString(result.categoryList[0]), objectToString(parentCategory[0]));
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If getCategory function throw error', async function () {
			const errorMessage = 'getCategory error';
			stubGetCategory.rejects(new Error(errorMessage));
			stubGetFixedColumnList.resolves(fixedColumnList);
			stubGetNotFixedColumnList.resolves(notFixedColumnList);

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					endDate: '',
					startDate: '',
				});

				fail('Expected to error.');
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					equal(err.message, errorMessage);
					sinon.assert.calledOnce(stubGetCategory);
					sinon.assert.notCalled(stubGetFixedColumnList);
					sinon.assert.notCalled(stubGetNotFixedColumnList);
					return;
				}
				fail(err as Error);
			}
		});

		it('If getFixedColumnList function throw error', async function () {
			const errorMessage = 'getFixedColumnList error';
			stubGetCategory.resolves([...parentCategory]);
			stubGetFixedColumnList.rejects(new Error(errorMessage));
			stubGetNotFixedColumnList.resolves(notFixedColumnList);

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					endDate: '',
					startDate: '',
				});

				fail('Expected to error.');
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					equal(err.message, errorMessage);
					sinon.assert.calledOnce(stubGetCategory);
					sinon.assert.calledOnce(stubGetFixedColumnList);
					sinon.assert.calledOnce(stubGetNotFixedColumnList);
					return;
				}
				fail(err as Error);
			}
		});

		it('If getNotFixedColumnList function throw error', async function () {
			const errorMessage = 'getNotFixedColumnList error';
			stubGetCategory.resolves([...parentCategory]);
			stubGetFixedColumnList.resolves(fixedColumnList);
			stubGetNotFixedColumnList.rejects(new Error(errorMessage));

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					endDate: '',
					startDate: '',
				});

				fail('Expected to error.');
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					equal(err.message, errorMessage);
					sinon.assert.calledOnce(stubGetCategory);
					sinon.assert.notCalled(stubGetFixedColumnList);
					sinon.assert.calledOnce(stubGetNotFixedColumnList);
					return;
				}
				fail(err as Error);
			}
		});
	});
});
