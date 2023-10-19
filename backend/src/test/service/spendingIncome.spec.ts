/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import sinon from 'sinon';

/** Test */
import dayjs from 'dayjs';
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
import {
	getFixedColumnList,
	getNotFixedColumnList,
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

/** Interface */
import { TColumnInfo } from '@/interface/model/cronGroupAccountBookRepository';
import { TGet } from '@/interface/api/response/accountBookResponse';

describe('SpendingIncome Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
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
			stubCreateNewFColumn.resolves(1);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

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
					needToUpdateDate: dayjs(defaultColumnInfo.needToUpdateDate).toDate(),
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
			stubCreateNewFColumn.resolves(1);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewFColumn, 1);

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check writer user', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo, userType: 'writer' }));
			stubCreateNewFColumn.resolves(1);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewFColumn, 1);

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check observer user', async function () {
			stubFindGroup.resolves(
				new GroupModel({ ...defaultGroupInfo, userType: 'observer' }),
			);
			stubCreateNewFColumn.resolves(1);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that observer type is unauthorized user.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewFColumn, 0);
			}
		});

		it('Check not existing group', async function () {
			stubFindGroup.resolves(null);
			stubCreateNewFColumn.resolves(1);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewFColumn, 0);
			}
		});

		it('If findGroup is error', async function () {
			stubFindGroup.rejects('findGroup error');
			stubCreateNewFColumn.resolves(1);

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewFColumn, 0);
			}
		});

		it('If createNewFColumn is error', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo }));
			stubCreateNewFColumn.rejects('findGroup error');

			const injectedFunc = createNewFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewFColumn, 1);
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
			stubCreateNewNFColumn.resolves(1);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				sinon.assert.calledWith(stubFindGroup, {
					accountBookId: defaultColumnInfo.accountBookId,
					userEmail: defaultColumnInfo.userEmail,
				});
				sinon.assert.calledWith(stubCreateNewNFColumn, {
					categoryId: defaultColumnInfo.categoryId,
					content: defaultColumnInfo.content,
					groupId: defaultGroupInfo.id,
					spendingAndIncomeDate: dayjs(defaultColumnInfo.spendingAndIncomeDate).toDate(),
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
			stubCreateNewNFColumn.resolves(1);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewNFColumn, 1);

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check writer user', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo, userType: 'writer' }));
			stubCreateNewNFColumn.resolves(1);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewNFColumn, 1);

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check observer user', async function () {
			stubFindGroup.resolves(
				new GroupModel({ ...defaultGroupInfo, userType: 'observer' }),
			);
			stubCreateNewNFColumn.resolves(1);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that observer type is unauthorized user.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewNFColumn, 0);
			}
		});

		it('Check not existing group', async function () {
			stubFindGroup.resolves(null);
			stubCreateNewNFColumn.resolves(1);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewNFColumn, 0);
			}
		});

		it('If findGroup is error', async function () {
			stubFindGroup.rejects('findGroup error');
			stubCreateNewNFColumn.resolves(1);

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewNFColumn, 0);
			}
		});

		it('If createNewNFColumn is error', async function () {
			stubFindGroup.resolves(new GroupModel({ ...defaultGroupInfo }));
			stubCreateNewNFColumn.rejects('findGroup error');

			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository,
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					return fail(err);
				}
				sinon.assert.callCount(stubFindGroup, 1);
				sinon.assert.callCount(stubCreateNewNFColumn, 1);
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
			needToUpdateDate: new Date(),
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
					needToUpdateDate: dayjs('2022-02-02').toDate(),
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
				sinon.assert.callCount(stubFindFixedGAB, 1);
				sinon.assert.callCount(stubUpdateFColumn, 0);
				sinon.assert.callCount(stubCheckAdminGroupUser, 0);
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

				sinon.assert.callCount(stubFindFixedGAB, 1);
				sinon.assert.callCount(stubUpdateFColumn, 1);
				sinon.assert.callCount(stubCheckAdminGroupUser, 0);
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

				sinon.assert.callCount(stubFindFixedGAB, 1);
				sinon.assert.callCount(stubUpdateFColumn, 1);
				sinon.assert.callCount(stubCheckAdminGroupUser, 1);

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
			stubCheckAdminGroupUser.rejects('Admin user 아님');

			const injectedFunc = updateFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
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
				sinon.assert.callCount(stubFindFixedGAB, 1);
				sinon.assert.callCount(stubUpdateFColumn, 0);
				sinon.assert.callCount(stubCheckAdminGroupUser, 1);
			}
		});

		it('Database join error ', async function () {
			const cgab = new CronGroupAccountBookModel({ ...defaultColumnInfo });

			stubFindFixedGAB.resolves(cgab);
			stubUpdateFColumn.resolves();
			stubCheckAdminGroupUser.resolves(new GroupModel({ ...defaultOwnerGroupInfo }));

			const injectedFunc = updateFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
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
					sinon.assert.callCount(stubFindFixedGAB, 1);
					sinon.assert.callCount(stubUpdateFColumn, 0);
					sinon.assert.callCount(stubCheckAdminGroupUser, 0);
					return;
				}
				fail(err as Error);
			}
		});
	});

	describe('#updateNotFixedColumn', function () {
		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			spendingAndIncomeDate: new Date(),
			type: 'income' as const,
			value: 100,
			content: '내용',
		};
		const defaultOwnerGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'writer' as const,
			accountBookId: 1,
		};

		it('If column is deleted in the past', async function () {
			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(new GroupModel({ ...defaultOwnerGroupInfo })),
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						return Promise.resolve(undefined);
					},
					updateNFColumn: (
						column: GroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
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
				ok(true);
			}
		});

		it("If column's owner is me", async function () {
			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(new GroupModel({ ...defaultOwnerGroupInfo })),
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						const cgab = new GroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					updateNFColumn: (
						column: GroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
					spendingAndIncomeDate: '2022-02-02',
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is admin", async function () {
			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(
							new GroupModel({
								userEmail: 'test2@naver.com',
								userType: 'manager', // or 'owner'
								accountBookId: 1,
							}),
						),
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						const cgab = new GroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					updateNFColumn: (
						column: GroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
					spendingAndIncomeDate: '2022-02-02',
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is not admin", async function () {
			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) => {
						throw new Error('Admin user 아님'); // user is writer or observer
					},
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						const cgab = new GroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					updateNFColumn: (
						column: GroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
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
				ok(true);
			}
		});

		it('Database join error ', async function () {
			const injectedFunc = updateNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) => {
						throw new Error('');
					},
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						return Promise.resolve(new GroupAccountBookModel({ ...defaultColumnInfo }));
					},
					updateNFColumn: (
						column: GroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
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
					ok(true);
					return;
				}
				fail(err as Error);
			}
		});
	});

	describe('#deleteFixedColumn', function () {
		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			cycleTime: 10,
			cycleType: 'd' as const,
			needToUpdateDate: new Date(),
			type: 'income' as const,
			value: 100,
			content: '내용',
		};
		const defaultOwnerGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'writer' as const,
			accountBookId: 1,
		};

		it('If column is deleted in the past', async function () {
			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(new GroupModel({ ...defaultOwnerGroupInfo })),
				},
				repository: {
					findFixedGAB: (
						gabInfo: Partial<TColumnInfo>,
						options?: {
							isIncludeGroup: boolean;
						},
					) => {
						return Promise.resolve(undefined);
					},
					deleteFColumn: (column: CronGroupAccountBookModel) => Promise.resolve(),
				},
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
				ok(true);
			}
		});

		it("If column's owner is me", async function () {
			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(new GroupModel({ ...defaultOwnerGroupInfo })),
				},
				repository: {
					findFixedGAB: (
						gabInfo: Partial<TColumnInfo>,
						options?: {
							isIncludeGroup: boolean;
						},
					) => {
						const cgab = new CronGroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					deleteFColumn: (column: CronGroupAccountBookModel) => Promise.resolve(),
				},
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is admin", async function () {
			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(
							new GroupModel({
								userEmail: 'test2@naver.com',
								userType: 'manager', // or 'owner'
								accountBookId: 1,
							}),
						),
				},
				repository: {
					findFixedGAB: (
						gabInfo: Partial<TColumnInfo>,
						options?: {
							isIncludeGroup: boolean;
						},
					) => {
						const cgab = new CronGroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					deleteFColumn: (column: CronGroupAccountBookModel) => Promise.resolve(),
				},
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is not admin", async function () {
			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) => {
						throw new Error('Admin user 아님'); // user is writer or observer
					},
				},
				repository: {
					findFixedGAB: (
						gabInfo: Partial<TColumnInfo>,
						options?: {
							isIncludeGroup: boolean;
						},
					) => {
						const cgab = new CronGroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					deleteFColumn: (column: CronGroupAccountBookModel) => Promise.resolve(),
				},
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
				ok(true);
			}
		});

		it('Database join error ', async function () {
			const injectedFunc = deleteFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) => {
						throw new Error('');
					},
				},
				repository: {
					findFixedGAB: (
						gabInfo: Partial<TColumnInfo>,
						options?: {
							isIncludeGroup: boolean;
						},
					) => {
						return Promise.resolve(
							new CronGroupAccountBookModel({ ...defaultColumnInfo }),
						);
					},
					deleteFColumn: (column: CronGroupAccountBookModel) => Promise.resolve(),
				},
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
					ok(true);
					return;
				}
				fail(err as Error);
			}
		});
	});

	describe('#deleteNotFixedColumn', function () {
		const defaultColumnInfo = {
			accountBookId: 1,
			categoryId: 1,
			spendingAndIncomeDate: new Date(),
			type: 'income' as const,
			value: 100,
			content: '내용',
		};
		const defaultOwnerGroupInfo = {
			userEmail: 'test@naver.com',
			userType: 'writer' as const,
			accountBookId: 1,
		};

		it('If column is deleted in the past', async function () {
			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(new GroupModel({ ...defaultOwnerGroupInfo })),
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						return Promise.resolve(undefined);
					},
					deleteNFColumn: (column: GroupAccountBookModel) => Promise.resolve(),
				},
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
				ok(true);
			}
		});

		it("If column's owner is me", async function () {
			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(new GroupModel({ ...defaultOwnerGroupInfo })),
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						const cgab = new GroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					deleteNFColumn: (column: GroupAccountBookModel) => Promise.resolve(),
				},
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is admin", async function () {
			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) =>
						Promise.resolve(
							new GroupModel({
								userEmail: 'test2@naver.com',
								userType: 'manager', // or 'owner'
								accountBookId: 1,
							}),
						),
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						const cgab = new GroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					deleteNFColumn: (column: GroupAccountBookModel) => Promise.resolve(),
				},
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is not admin", async function () {
			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) => {
						throw new Error('Admin user 아님'); // user is writer or observer
					},
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						const cgab = new GroupAccountBookModel({ ...defaultColumnInfo });
						const group = new GroupModel({ ...defaultOwnerGroupInfo });
						cgab.groups = group;

						return Promise.resolve(cgab);
					},
					deleteNFColumn: (column: GroupAccountBookModel) => Promise.resolve(),
				},
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
				ok(true);
			}
		});

		it('Database join error ', async function () {
			const injectedFunc = deleteNotFixedColumn({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				service: {
					checkAdminGroupUser: (info: { userEmail: string; accountBookId: number }) => {
						throw new Error('');
					},
				},
				repository: {
					findNotFixedGAB: (
						gabInfo: Parameters<typeof findNotFixedGAB>[0],
						options?: Parameters<typeof findNotFixedGAB>[1],
					) => {
						return Promise.resolve(new GroupAccountBookModel({ ...defaultColumnInfo }));
					},
					deleteNFColumn: (column: GroupAccountBookModel) => Promise.resolve(),
				},
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
					ok(true);
					return;
				}
				fail(err as Error);
			}
		});
	});

	describe('#getDefaultInfo', function () {
		const curDate = new Date();
		const nextDate = new Date();
		nextDate.setDate(curDate.getDate() + 1);
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

		it('Check correct result', async function () {
			const injectedFunc = getDefaultInfo({
				...common,
				service: {
					getCategory: (
						accountBookId: number,
						depth?: {
							start: number;
							end: number;
						},
					) => {
						return Promise.resolve([...parentCategory]);
					},
					getFixedColumnList: (
						info: Parameters<typeof getFixedColumnList>[0],
						categoryList: Parameters<typeof getFixedColumnList>[1],
					): Promise<TGet['data']['history']['fixedList']> => {
						return Promise.resolve(fixedColumnList);
					},
					getNotFixedColumnList: (
						info: Parameters<typeof getNotFixedColumnList>[0],
						categoryList: Parameters<typeof getNotFixedColumnList>[1],
					): Promise<TGet['data']['history']['notFixedList']> => {
						return Promise.resolve(notFixedColumnList);
					},
				},
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
			const injectedFunc = getDefaultInfo({
				...common,
				service: {
					getCategory: (
						accountBookId: number,
						depth?: {
							start: number;
							end: number;
						},
					) => {
						throw new Error(errorMessage);
					},
					getFixedColumnList: (
						info: Parameters<typeof getFixedColumnList>[0],
						categoryList: Parameters<typeof getFixedColumnList>[1],
					): Promise<TGet['data']['history']['fixedList']> => {
						return Promise.resolve(fixedColumnList);
					},
					getNotFixedColumnList: (
						info: Parameters<typeof getNotFixedColumnList>[0],
						categoryList: Parameters<typeof getNotFixedColumnList>[1],
					): Promise<TGet['data']['history']['notFixedList']> => {
						return Promise.resolve(notFixedColumnList);
					},
				},
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
					return;
				}
				fail(err as Error);
			}
		});

		it('If getFixedColumnList function throw error', async function () {
			const errorMessage = 'getFixedColumnList error';
			const injectedFunc = getDefaultInfo({
				...common,
				service: {
					getCategory: (
						accountBookId: number,
						depth?: {
							start: number;
							end: number;
						},
					) => {
						return Promise.resolve([...parentCategory]);
					},
					getFixedColumnList: (
						info: Parameters<typeof getFixedColumnList>[0],
						categoryList: Parameters<typeof getFixedColumnList>[1],
					): Promise<TGet['data']['history']['fixedList']> => {
						throw new Error(errorMessage);
					},
					getNotFixedColumnList: (
						info: Parameters<typeof getNotFixedColumnList>[0],
						categoryList: Parameters<typeof getNotFixedColumnList>[1],
					): Promise<TGet['data']['history']['notFixedList']> => {
						return Promise.resolve(notFixedColumnList);
					},
				},
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
					return;
				}
				fail(err as Error);
			}
		});

		it('If getNotFixedColumnList function throw error', async function () {
			const errorMessage = 'getNotFixedColumnList error';
			const injectedFunc = getDefaultInfo({
				...common,
				service: {
					getCategory: (
						accountBookId: number,
						depth?: {
							start: number;
							end: number;
						},
					) => {
						return Promise.resolve([...parentCategory]);
					},
					getFixedColumnList: (
						info: Parameters<typeof getFixedColumnList>[0],
						categoryList: Parameters<typeof getFixedColumnList>[1],
					): Promise<TGet['data']['history']['fixedList']> => {
						return Promise.resolve(fixedColumnList);
					},
					getNotFixedColumnList: (
						info: Parameters<typeof getNotFixedColumnList>[0],
						categoryList: Parameters<typeof getNotFixedColumnList>[1],
					): Promise<TGet['data']['history']['notFixedList']> => {
						throw new Error(errorMessage);
					},
				},
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
					return;
				}
				fail(err as Error);
			}
		});
	});
});
