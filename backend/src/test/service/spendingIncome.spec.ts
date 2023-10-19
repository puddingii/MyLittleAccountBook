/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';

/** Test */
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

/** Model */
import GroupModel from '@/model/group';
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupAccountBookModel from '@/model/groupAccountBook';

/** Interface */
import { TColumnInfo } from '@/interface/model/cronGroupAccountBookRepository';
import { findGAB } from '@/repository/groupAccountBookRepository/dependency';
import { TGet } from '@/interface/api/response/accountBookResponse';

describe('SpendingIncome Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};

	describe('#createNewFixedColumn', function () {
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
		it('Check owner user', async function () {
			const injectedFunc = createNewFixedColumn({
				...common,
				repository: {
					createNewFColumn: (columnInfo: Omit<TColumnInfo, 'id'>) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) => Promise.resolve(new GroupModel({ ...defaultGroupInfo })),
				},
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check manager user', async function () {
			const injectedFunc = createNewFixedColumn({
				...common,
				repository: {
					createNewFColumn: (columnInfo: Omit<TColumnInfo, 'id'>) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) =>
						Promise.resolve(new GroupModel({ ...defaultGroupInfo, userType: 'manager' })),
				},
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check writer user', async function () {
			const injectedFunc = createNewFixedColumn({
				...common,
				repository: {
					createNewFColumn: (columnInfo: Omit<TColumnInfo, 'id'>) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) =>
						Promise.resolve(new GroupModel({ ...defaultGroupInfo, userType: 'writer' })),
				},
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check observer user', async function () {
			const injectedFunc = createNewFixedColumn({
				...common,
				repository: {
					createNewFColumn: (columnInfo: Omit<TColumnInfo, 'id'>) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) =>
						Promise.resolve(
							new GroupModel({ ...defaultGroupInfo, userType: 'observer' }),
						),
				},
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that observer type is unauthorized user.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				ok(true);
			}
		});

		it('Check not existing group', async function () {
			const injectedFunc = createNewFixedColumn({
				...common,
				repository: {
					createNewFColumn: (columnInfo: Omit<TColumnInfo, 'id'>) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) => Promise.resolve(null),
				},
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				ok(true);
			}
		});
	});

	describe('#createNewNotFixedColumn', function () {
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
		it('Check owner user', async function () {
			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository: {
					createNewNFColumn: (columnInfo: {
						categoryId: number;
						spendingAndIncomeDate: Date;
						value: number;
						content?: string | undefined;
						groupId: number;
						type: 'income' | 'spending';
					}) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) => Promise.resolve(new GroupModel({ ...defaultGroupInfo })),
				},
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check manager user', async function () {
			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository: {
					createNewNFColumn: (columnInfo: {
						categoryId: number;
						spendingAndIncomeDate: Date;
						value: number;
						content?: string | undefined;
						groupId: number;
						type: 'income' | 'spending';
					}) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) =>
						Promise.resolve(new GroupModel({ ...defaultGroupInfo, userType: 'manager' })),
				},
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check writer user', async function () {
			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository: {
					createNewNFColumn: (columnInfo: {
						categoryId: number;
						spendingAndIncomeDate: Date;
						value: number;
						content?: string | undefined;
						groupId: number;
						type: 'income' | 'spending';
					}) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) =>
						Promise.resolve(new GroupModel({ ...defaultGroupInfo, userType: 'writer' })),
				},
			});

			try {
				const result = await injectedFunc({ ...defaultColumnInfo });

				equal(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check observer user', async function () {
			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository: {
					createNewNFColumn: (columnInfo: {
						categoryId: number;
						spendingAndIncomeDate: Date;
						value: number;
						content?: string | undefined;
						groupId: number;
						type: 'income' | 'spending';
					}) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) =>
						Promise.resolve(
							new GroupModel({ ...defaultGroupInfo, userType: 'observer' }),
						),
				},
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that observer type is unauthorized user.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				ok(true);
			}
		});

		it('Check not existing group', async function () {
			const injectedFunc = createNewNotFixedColumn({
				...common,
				repository: {
					createNewNFColumn: (columnInfo: {
						categoryId: number;
						spendingAndIncomeDate: Date;
						value: number;
						content?: string | undefined;
						groupId: number;
						type: 'income' | 'spending';
					}) => Promise.resolve(1),
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) => Promise.resolve(null),
				},
			});

			try {
				await injectedFunc({ ...defaultColumnInfo });

				fail('Expected to error that group is not found.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				ok(true);
			}
		});
	});

	describe('#updateFixedColumn', function () {
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
			const injectedFunc = updateFixedColumn({
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
					updateFColumn: (
						column: CronGroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
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
				ok(true);
			}
		});

		it("If column's owner is me", async function () {
			const injectedFunc = updateFixedColumn({
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
					updateFColumn: (
						column: CronGroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test@naver.com',
					id: 1,
					needToUpdateDate: '2022-02-02',
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is admin", async function () {
			const injectedFunc = updateFixedColumn({
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
					updateFColumn: (
						column: CronGroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
			});

			try {
				await injectedFunc({
					...defaultColumnInfo,
					userEmail: 'test2@naver.com',
					id: 1,
					needToUpdateDate: '2022-02-02',
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If column's owner isn't me and user who is updating column is not admin", async function () {
			const injectedFunc = updateFixedColumn({
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
					updateFColumn: (
						column: CronGroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
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
				ok(true);
			}
		});

		it('Database join error ', async function () {
			const injectedFunc = updateFixedColumn({
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
					updateFColumn: (
						column: CronGroupAccountBookModel,
						columnInfo: Partial<Omit<TColumnInfo, 'id' | 'groupId'>>,
					) => Promise.resolve(),
				},
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
					ok(true);
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
						gabInfo: Parameters<typeof findGAB>[0],
						options?: Parameters<typeof findGAB>[1],
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
