/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import sinon from 'sinon';
import { Transaction } from 'sequelize';

/** Service */
import {
	getCategoryList,
	addCategory,
	deleteCategory,
	updateCategoryInfo,
} from '@/service/manageCategory';

/** Model */
import CategoryModel from '@/model/category';
import GroupModel from '@/model/group';

/** Dependency */
import { cacheUtil, errorUtil } from '../commonDependency';
import { findGAB as findFGAB } from '@/repository/cronGroupAccountBookRepository/dependency';
import { findGAB } from '@/repository/groupAccountBookRepository/dependency';
import {
	createCategory,
	findCategory,
	findCategoryList,
	updateCategory,
	deleteCategory as deleteCategoryR,
} from '@/repository/categoryRepository/dependency';
import { checkAdminGroupUser } from '@/service/common/user/dependency';
import sequelize from '@/loader/mysql';

/** Model */
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupAccountBookModel from '@/model/groupAccountBook';

describe('ManageCategory Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
		cacheUtil: {
			deleteCache: cacheUtil.deleteCache,
		},
	};
	const database = { sequelize };
	let stubTransaction = sinon.stub(database.sequelize, 'transaction');
	stubTransaction.callsFake(function () {
		return Promise.resolve({
			commit: () => Promise.resolve(),
			rollback: () => Promise.resolve(),
			afterCommit: () => Promise.resolve(),
			LOCK: 'SHARE' as unknown,
		}) as Promise<Transaction>;
	});

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

	describe('#getCategoryList', function () {
		const parentCategoryList = [
			new CategoryModel({ name: '부모0 카테고리', accountBookId: 1, id: 0 }),
			new CategoryModel({ name: '부모1 카테고리', accountBookId: 1, id: 4 }),
		];
		const childCategoryList = [
			new CategoryModel({ name: '자식0 카테고리', accountBookId: 1, id: 1, parentId: 0 }),
			new CategoryModel({ name: '자식1 카테고리', accountBookId: 1, id: 2, parentId: 0 }),
			new CategoryModel({ name: '자식2 카테고리', accountBookId: 1, id: 3, parentId: 0 }),
			new CategoryModel({
				name: '자식00 카테고리',
				accountBookId: 1,
				id: 5,
				parentId: 4,
			}),
			new CategoryModel({
				name: '자식11 카테고리',
				accountBookId: 1,
				id: 6,
				parentId: 4,
			}),
		];
		const repository = { findCategoryList };
		let stubFindCategoryList = sinon.stub(repository, 'findCategoryList');

		beforeEach(function () {
			stubFindCategoryList = sinon.stub(repository, 'findCategoryList');
		});

		it('Check function parameters', async function () {
			stubFindCategoryList.resolves([...parentCategoryList, ...childCategoryList]);

			const injectedFunc = getCategoryList({
				...common,
				repository,
			});

			try {
				await injectedFunc({ accountBookId: 1 });

				sinon.assert.calledWith(stubFindCategoryList, { accountBookId: 1 });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindCategoryList.resolves([...parentCategoryList, ...childCategoryList]);

			const injectedFunc = getCategoryList({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ accountBookId: 1 });

				equal(result[0].name, parentCategoryList[0].name);
				equal(result[0].id, parentCategoryList[0].id);
				equal(result[0].parentId, parentCategoryList[0].parentId);
				equal(result[0].childList.length, 3);
				equal(result[1].name, parentCategoryList[1].name);
				equal(result[1].id, parentCategoryList[1].id);
				equal(result[1].parentId, parentCategoryList[1].parentId);
				equal(result[1].childList.length, 2);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check child categoryList(parent cateogory is not existed)', async function () {
			stubFindCategoryList.resolves([...childCategoryList]);

			const injectedFunc = getCategoryList({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc({ accountBookId: 1 });

				equal(result.length, 0);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findCategoryList throw error', async function () {
			stubFindCategoryList.rejects(new Error('findCategoryList error'));

			const injectedFunc = getCategoryList({
				...common,
				repository,
			});

			try {
				await injectedFunc({ accountBookId: 1 });

				fail('Expected to error.');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				ok(true);
			}
		});
	});

	describe('#addCategory', function () {
		const service = { checkAdminGroupUser };
		const repository = { createCategory, findCategory };
		let stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		let stubCreateCategory = sinon.stub(repository, 'createCategory');
		let stubFindCategory = sinon.stub(repository, 'findCategory');

		beforeEach(function () {
			stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
			stubCreateCategory = sinon.stub(repository, 'createCategory');
			stubFindCategory = sinon.stub(repository, 'findCategory');
		});

		it('If checkAdminGroupUser error', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
			};
			const newParentCategoryId = 2;
			const childCategoryInfo = {
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.rejects(new Error('checkAdminGroupUser error'));
			stubFindCategory.resolves(null);
			stubCreateCategory
				.withArgs(sinon.match({ name: parentCategoryInfo.name }))
				.resolves(new CategoryModel({ ...parentCategoryInfo, id: newParentCategoryId }));
			stubCreateCategory
				.withArgs(sinon.match({ parentId: newParentCategoryId }))
				.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...parentCategoryInfo,
				});
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.notCalled(stubFindCategory);
				sinon.assert.notCalled(stubCreateCategory);
			}
		});

		it('Check dependency function parameters(main category)', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
			};
			const newParentCategoryId = 2;
			const childCategoryInfo = {
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(null);
			stubCreateCategory
				.withArgs(sinon.match({ name: parentCategoryInfo.name }))
				.resolves(new CategoryModel({ ...parentCategoryInfo, id: newParentCategoryId }));
			stubCreateCategory
				.withArgs(sinon.match({ parentId: newParentCategoryId }))
				.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...parentCategoryInfo,
				});

				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: 'test@naver.com',
					accountBookId: parentCategoryInfo.accountBookId,
				});
				stubCreateCategory.getCall(0).calledWith({ ...parentCategoryInfo });
				stubCreateCategory.getCall(1).calledWith({ ...childCategoryInfo });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check main category', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
			};
			const newParentCategoryId = 2;
			const childCategoryInfo = {
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(null);
			stubCreateCategory
				.withArgs(sinon.match({ name: parentCategoryInfo.name }))
				.resolves(new CategoryModel({ ...parentCategoryInfo, id: newParentCategoryId }));
			stubCreateCategory
				.withArgs(sinon.match({ parentId: newParentCategoryId }))
				.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				const result = await injectedFunc({
					myEmail: 'test@naver.com',
					...parentCategoryInfo,
				});

				equal(result.id, newParentCategoryId);
				sinon.assert.match((result.childList ?? [])[0], childCategoryInfo);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.notCalled(stubFindCategory);
				sinon.assert.calledTwice(stubCreateCategory);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check main category with findCategory error', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
			};
			const newParentCategoryId = 2;
			const childCategoryInfo = {
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.rejects(new Error('findCategory error'));
			stubCreateCategory
				.withArgs(sinon.match({ name: parentCategoryInfo.name }))
				.resolves(new CategoryModel({ ...parentCategoryInfo, id: newParentCategoryId }));
			stubCreateCategory
				.withArgs(sinon.match({ parentId: newParentCategoryId }))
				.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				const result = await injectedFunc({
					myEmail: 'test@naver.com',
					...parentCategoryInfo,
				});

				equal(result.id, newParentCategoryId);
				sinon.assert.match((result.childList ?? [])[0], childCategoryInfo);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.notCalled(stubFindCategory);
				sinon.assert.calledTwice(stubCreateCategory);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check main category with first createCategory error', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
			};
			const newParentCategoryId = 2;
			const childCategoryInfo = {
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(null);
			stubCreateCategory
				.withArgs(sinon.match({ name: parentCategoryInfo.name }))
				.rejects(new Error('first createCategory error'));
			stubCreateCategory
				.withArgs(sinon.match({ parentId: newParentCategoryId }))
				.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...parentCategoryInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.notCalled(stubFindCategory);
				sinon.assert.calledOnce(stubCreateCategory);
			}
		});

		it('Check main category with second createCategory error', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
			};
			const newParentCategoryId = 2;

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(null);
			stubCreateCategory
				.withArgs(sinon.match({ name: parentCategoryInfo.name }))
				.resolves(new CategoryModel({ ...parentCategoryInfo, id: newParentCategoryId }));
			stubCreateCategory
				.withArgs(sinon.match({ parentId: newParentCategoryId }))
				.rejects(new Error('second createCategory error'));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...parentCategoryInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.notCalled(stubFindCategory);
				sinon.assert.calledTwice(stubCreateCategory);
			}
		});

		it('Check sub category', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
				id: 2,
			};
			const childCategoryInfo = {
				accountBookId: 1,
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(new CategoryModel({ ...parentCategoryInfo }));
			stubCreateCategory.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				const result = await injectedFunc({
					myEmail: 'test@naver.com',
					...childCategoryInfo,
				});

				equal(result.id, childCategoryInfo.id);
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.calledOnce(stubCreateCategory);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check dependency function parameters(sub category)', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
				id: 2,
			};
			const childCategoryInfo = {
				accountBookId: 1,
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(new CategoryModel({ ...parentCategoryInfo }));
			stubCreateCategory.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...childCategoryInfo,
				});

				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: 'test@naver.com',
					accountBookId: parentCategoryInfo.accountBookId,
				});
				sinon.assert.calledWith(stubFindCategory, {
					accountBookId: childCategoryInfo.accountBookId,
					id: childCategoryInfo.parentId,
				});
				sinon.assert.calledWith(stubCreateCategory, { ...childCategoryInfo });
			} catch (err) {
				fail(err as Error);
			}
		});

		it("Check sub category with findCategory's return value is null ", async function () {
			const childCategoryInfo = {
				accountBookId: 1,
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(null);
			stubCreateCategory.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...childCategoryInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.notCalled(stubCreateCategory);
			}
		});

		it('Check sub category with findCategory error', async function () {
			const childCategoryInfo = {
				accountBookId: 1,
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.rejects(new Error('findCategory error'));
			stubCreateCategory.resolves(new CategoryModel(childCategoryInfo));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...childCategoryInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.notCalled(stubCreateCategory);
			}
		});

		it('Check sub category with createCategory error', async function () {
			const parentCategoryInfo = {
				accountBookId: 1,
				name: '새로운 부모카테고리',
				id: 2,
			};
			const childCategoryInfo = {
				accountBookId: 1,
				id: 3,
				parentId: 2,
				name: '기타',
			};

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(new CategoryModel(parentCategoryInfo));
			stubCreateCategory.rejects(new Error('createCategory error'));

			const injectedFunc = addCategory({
				...common,
				...database,
				service,
				errorUtil,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...childCategoryInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.calledOnce(stubCreateCategory);
			}
		});
	});

	describe('#updateCategoryInfo', function () {
		const service = { checkAdminGroupUser };
		const repository = { updateCategory };
		let stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		let stubUpdateCategory = sinon.stub(repository, 'updateCategory');

		beforeEach(function () {
			stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
			stubUpdateCategory = sinon.stub(repository, 'updateCategory');
		});

		it('Check function parameters', async function () {
			const categoryInfo = {
				accountBookId: 1,
				id: 3,
				name: '기타',
			};
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubUpdateCategory.resolves([1]);

			const injectedFunc = updateCategoryInfo({
				...common,
				service,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...categoryInfo,
				});

				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: 'test@naver.com',
					accountBookId: categoryInfo.accountBookId,
				});
				sinon.assert.calledWith(stubUpdateCategory, { ...categoryInfo });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			const categoryInfo = {
				accountBookId: 1,
				id: 3,
				name: '기타',
			};
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubUpdateCategory.resolves([1]);

			const injectedFunc = updateCategoryInfo({
				...common,
				service,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...categoryInfo,
				});

				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubUpdateCategory);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If checkAdminGroupUser error', async function () {
			const categoryInfo = {
				accountBookId: 1,
				id: 3,
				name: '기타',
			};
			stubCheckAdminGroupUser.rejects(new Error('checkAdminGroupUser error'));
			stubUpdateCategory.resolves([1]);

			const injectedFunc = updateCategoryInfo({
				...common,
				service,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...categoryInfo,
				});
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err as Error);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.notCalled(stubUpdateCategory);
			}
		});

		it('If updateCategory error', async function () {
			const categoryInfo = {
				accountBookId: 1,
				id: 3,
				name: '기타',
			};
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubUpdateCategory.rejects(new Error('updateCategory error'));

			const injectedFunc = updateCategoryInfo({
				...common,
				service,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...categoryInfo,
				});
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err as Error);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubUpdateCategory);
			}
		});

		it('If updateCategory result is 0', async function () {
			const categoryInfo = {
				accountBookId: 1,
				id: 3,
				name: '기타',
			};
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubUpdateCategory.resolves([0]);

			const injectedFunc = updateCategoryInfo({
				...common,
				service,
				repository,
			});

			try {
				await injectedFunc({
					myEmail: 'test@naver.com',
					...categoryInfo,
				});
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err as Error);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubUpdateCategory);
			}
		});
	});

	describe('#deleteCategory', function () {
		const service = { checkAdminGroupUser };
		const repository = {
			findCategory,
			findCategoryList,
			findFGAB,
			findGAB,
			deleteCategory: deleteCategoryR,
		};
		let stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
		let stubFindCategory = sinon.stub(repository, 'findCategory');
		let stubFindCategoryList = sinon.stub(repository, 'findCategoryList');
		let stubFindFGAB = sinon.stub(repository, 'findFGAB');
		let stubFindGAB = sinon.stub(repository, 'findGAB');
		let stubDeleteCategory = sinon.stub(repository, 'deleteCategory');

		beforeEach(function () {
			stubCheckAdminGroupUser = sinon.stub(service, 'checkAdminGroupUser');
			stubFindCategory = sinon.stub(repository, 'findCategory');
			stubFindCategoryList = sinon.stub(repository, 'findCategoryList');
			stubFindFGAB = sinon.stub(repository, 'findFGAB');
			stubFindGAB = sinon.stub(repository, 'findGAB');
			stubDeleteCategory = sinon.stub(repository, 'deleteCategory');
		});

		it('If checkAdminGroupUser error', async function () {
			const category = new CategoryModel({ name: '부모 카테고리', accountBookId: 1 });
			sinon.stub(category);

			stubCheckAdminGroupUser.rejects(new Error('checkAdminGroupUser error'));
			stubFindCategory.resolves(null);
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.notCalled(stubFindCategory);
				sinon.assert.notCalled(stubFindCategoryList);
				sinon.assert.notCalled(stubFindFGAB);
				sinon.assert.notCalled(stubFindGAB);
			}
		});

		it('If findCategory return is null', async function () {
			const category = new CategoryModel({ name: '부모 카테고리', accountBookId: 1 });
			sinon.stub(category);

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(null);
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.notCalled(stubFindCategoryList);
				sinon.assert.notCalled(stubFindFGAB);
				sinon.assert.notCalled(stubFindGAB);
			}
		});

		it('Check function parameters(main category)', async function () {
			const category = new CategoryModel({ name: '부모 카테고리', accountBookId: 1 });
			sinon.stub(category);

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(category);
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });

				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubFindCategory, { accountBookId: 1, id: 1 });
				sinon.assert.calledWith(stubFindCategoryList, { accountBookId: 1, parentId: 1 });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check main category with sub category is not existed', async function () {
			const category = new CategoryModel({ name: '부모 카테고리', accountBookId: 1 });
			sinon.stub(category);

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(category);
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });

				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.calledOnce(stubFindCategoryList);
				sinon.assert.notCalled(stubFindFGAB);
				sinon.assert.notCalled(stubFindGAB);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check main category with sub category is existed', async function () {
			const category = new CategoryModel({ name: '부모 카테고리', accountBookId: 1 });
			sinon.stub(category);

			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(category);
			stubFindCategoryList.resolves([new CategoryModel()]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.calledOnce(stubFindCategoryList);
				sinon.assert.notCalled(stubFindFGAB);
				sinon.assert.notCalled(stubFindGAB);
			}
		});

		it('Check function parameters(sub category)', async function () {
			const categoryInfo = {
				id: 1,
				name: '서브 카테고리',
				accountBookId: 1,
				parentId: 1,
			};
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(new CategoryModel(categoryInfo));
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });

				sinon.assert.calledWith(stubCheckAdminGroupUser, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubFindCategory, { accountBookId: 1, id: 1 });
				sinon.assert.calledWith(stubFindFGAB, { categoryId: categoryInfo.id });
				sinon.assert.calledWith(stubFindGAB, { categoryId: categoryInfo.id });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check sub category with history(gab, cgab) is not existed', async function () {
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(
				new CategoryModel({
					name: '서브 카테고리',
					accountBookId: 1,
					parentId: 1,
				}),
			);
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });

				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.notCalled(stubFindCategoryList);
				sinon.assert.calledOnce(stubFindFGAB);
				sinon.assert.calledOnce(stubFindGAB);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If deleteCategory return 0', async function () {
			const cacheUtil = common.cacheUtil;
			const stubDeleteCache = sinon.stub(cacheUtil, 'deleteCache');
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(
				new CategoryModel({
					name: '서브 카테고리',
					accountBookId: 1,
					parentId: 1,
				}),
			);
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(0);
			stubDeleteCache.resolves();

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
				cacheUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });

				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.notCalled(stubFindCategoryList);
				sinon.assert.calledOnce(stubFindFGAB);
				sinon.assert.calledOnce(stubFindGAB);
				sinon.assert.notCalled(stubDeleteCache);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check sub category with history(cgab) is existed', async function () {
			const category = new CategoryModel({
				name: '서브 카테고리',
				accountBookId: 1,
				parentId: 1,
			});
			category.destroy = async () => {};
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(category);
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(new CronGroupAccountBookModel());
			stubFindGAB.resolves(undefined);
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.notCalled(stubFindCategoryList);
				sinon.assert.calledOnce(stubFindFGAB);
				sinon.assert.notCalled(stubFindGAB);
			}
		});

		it('Check sub category with history(gab) is existed', async function () {
			stubCheckAdminGroupUser.resolves(new GroupModel());
			stubFindCategory.resolves(
				new CategoryModel({
					name: '서브 카테고리',
					accountBookId: 1,
					parentId: 1,
				}),
			);
			stubFindCategoryList.resolves([]);
			stubFindFGAB.resolves(undefined);
			stubFindGAB.resolves(new GroupAccountBookModel());
			stubDeleteCategory.resolves(1);

			const injectedFunc = deleteCategory({
				...common,
				...database,
				repository,
				service,
				errorUtil,
			});

			try {
				await injectedFunc({ accountBookId: 1, id: 1, myEmail: 'test@naver.com' });
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCheckAdminGroupUser);
				sinon.assert.calledOnce(stubFindCategory);
				sinon.assert.notCalled(stubFindCategoryList);
				sinon.assert.calledOnce(stubFindFGAB);
				sinon.assert.calledOnce(stubFindGAB);
			}
		});
	});
});
