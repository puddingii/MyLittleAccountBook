/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepStrictEqual, equal, fail } from 'assert';
import sinon from 'sinon';
import {
	BulkCreateOptions,
	CreateOptions,
	DestroyOptions,
	FindOptions,
	Model,
	Optional,
	QueryOptions,
	QueryOptionsWithType,
	QueryTypes,
	UpdateOptions,
} from 'sequelize';

/** Repository */
import {
	createCategory,
	createDefaultCategory,
	deleteChildCategoryList,
	findCategory,
	findCategoryList,
	findRecursiveCategoryList,
	updateCategory,
} from '@/repository/categoryRepository';

/** Dependency */
import { errorUtil } from '../commonDependency';
import sequelize from '@/loader/mysql';
import defaultCategory from '@/json/defaultCategory.json';

/** Model */
import CategoryModel from '@/model/category';

describe('Category Repository Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};

	describe('#findRecursiveCategoryList', function () {
		let spyQuery: sinon.SinonSpy<
			[
				sql:
					| string
					| {
							query: string;
							values: unknown[];
					  },
				options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW> | undefined,
			],
			Promise<[unknown[], unknown]>
		>;
		let stubQuery: sinon.SinonStub<
			[
				sql:
					| string
					| {
							query: string;
							values: unknown[];
					  },
				options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW> | undefined,
			],
			Promise<[unknown[], unknown]>
		>;

		it('Check function parameters', async function () {
			spyQuery = sinon.spy(sequelize, 'query');
			const injectedFunc = findRecursiveCategoryList({ ...common, sequelize });

			try {
				await injectedFunc(1, { end: 2, start: 2 });

				sinon.assert.calledOnce(spyQuery);
				sinon.assert.calledWith(
					spyQuery,
					`WITH RECURSIVE category_list AS (
				SELECT *, CAST(name AS CHAR(100)) AS categoryNamePath, CAST(id AS CHAR(100)) AS categoryIdPath, 1 as depth
				FROM categorys
				WHERE parentId IS NULL AND accountBookId = 1
				UNION ALL
				SELECT c.*, CONCAT(cl.name, ' > ', c.name) AS categoryNamePath, CONCAT(cl.id, ' > ', c.id) AS categoryIdPath, depth+1
				FROM category_list cl
				INNER JOIN categorys c
				ON c.parentId=cl.id
				)
			SELECT * FROM category_list WHERE depth BETWEEN 2 AND 2 ORDER BY depth ASC;`,
					{ type: QueryTypes.SELECT },
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyQuery = sinon.spy(sequelize, 'query');
			const injectedFunc = findRecursiveCategoryList({ ...common, sequelize });

			try {
				const result = await injectedFunc(1, { end: 2, start: 2 });

				result.forEach(category => {
					deepStrictEqual(category.categoryNamePath.split(' > ').length, 2);
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If category list length is 0', async function () {
			spyQuery = sinon.spy(sequelize, 'query');
			const injectedFunc = findRecursiveCategoryList({ ...common, sequelize });

			try {
				const result = await injectedFunc(9999990909, { end: 2, start: 2 });

				deepStrictEqual(result, []);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If query error', async function () {
			stubQuery = sinon.stub(sequelize, 'query');
			stubQuery.rejects(new Error('query error'));
			const injectedFunc = findRecursiveCategoryList({ ...common, sequelize });

			try {
				await injectedFunc(1, { end: 2, start: 2 });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubQuery);
			}
		});
	});

	describe('#findCategoryList', function () {
		let spyFindAll: sinon.SinonSpy<
			[options?: FindOptions<any> | undefined],
			Promise<Model<any, any>[]>
		>;
		let stubFindAll: sinon.SinonStub<
			[options?: FindOptions<any> | undefined],
			Promise<Model<any, any>[]>
		>;

		it('Check function parameters', async function () {
			spyFindAll = sinon.spy(CategoryModel, 'findAll');
			const injectedFunc = findCategoryList({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1, id: 1 };
				await injectedFunc(info);

				sinon.assert.calledWith(spyFindAll, {
					where: info,
					order: [
						['parentId', 'ASC'],
						['name', 'ASC'],
					],
				});
				sinon.assert.calledOnce(spyFindAll);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyFindAll = sinon.spy(CategoryModel, 'findAll');
			const injectedFunc = findCategoryList({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1 };
				const sortedList = defaultCategory.rootCategory.sort((a, b) =>
					a.name.localeCompare(b.name),
				);

				const result = await injectedFunc(info);

				const rootCategoryLength = defaultCategory.rootCategory.length;
				equal(result.length, rootCategoryLength * 2);
				for (let i = 0; i < rootCategoryLength * 2; i++) {
					if (rootCategoryLength <= i) {
						equal(result[i].name, '기타');
					} else {
						equal(result[i].name, sortedList[i].name);
					}
				}

				const result2 = await injectedFunc({ ...info, id: 1 });
				equal(result2.length, 1);

				const result3 = await injectedFunc({ ...info, name: '기타' });
				equal(result3.length, rootCategoryLength);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If category is null', async function () {
			spyFindAll = sinon.spy(CategoryModel, 'findAll');
			const injectedFunc = findCategoryList({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 99990909090, id: 1 };
				const result = await injectedFunc(info);

				deepStrictEqual(result, []);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findAll error', async function () {
			stubFindAll = sinon.stub(CategoryModel, 'findAll');
			stubFindAll.rejects(new Error('findAll error'));
			const injectedFunc = findCategoryList({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1 };

				await injectedFunc(info);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindAll);
			}
		});
	});

	describe('#findCategory', function () {
		let spyFindOne: sinon.SinonSpy<
			[options?: FindOptions<any> | undefined],
			Promise<Model<any, any> | null>
		>;
		let stubFindOne: sinon.SinonStub<
			[options?: FindOptions<any> | undefined],
			Promise<Model<any, any> | null>
		>;

		it('Check function parameters', async function () {
			spyFindOne = sinon.spy(CategoryModel, 'findOne');
			const injectedFunc = findCategory({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1, id: 1 };
				await injectedFunc(info);

				sinon.assert.calledWith(spyFindOne, {
					where: info,
				});
				sinon.assert.calledOnce(spyFindOne);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyFindOne = sinon.spy(CategoryModel, 'findOne');
			const injectedFunc = findCategory({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1, id: 1 };

				const result = await injectedFunc(info);

				deepStrictEqual({ id: result?.id, accountBookId: result?.accountBookId }, info);
				equal(result instanceof CategoryModel, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If category is null', async function () {
			spyFindOne = sinon.spy(CategoryModel, 'findOne');
			const injectedFunc = findCategory({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 90990999999, id: 1 };

				const result = await injectedFunc(info);

				equal(result, null);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findOne error', async function () {
			stubFindOne = sinon.stub(CategoryModel, 'findOne');
			stubFindOne.rejects(new Error('findOne error'));
			const injectedFunc = findCategory({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1 };

				await injectedFunc(info);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindOne);
			}
		});
	});

	describe('#createCategory', function () {
		let spyCreate: sinon.SinonSpy<
			[
				values?: Optional<any, string> | undefined,
				options?: CreateOptions<any> | undefined,
			],
			Promise<Model<any, any>>
		>;

		let stubCreate: sinon.SinonStub<
			[
				values?: Optional<any, string> | undefined,
				options?: CreateOptions<any> | undefined,
			],
			Promise<Model<any, any>>
		>;

		it('Check function parameters', async function () {
			spyCreate = sinon.spy(CategoryModel, 'create');
			const injectedFunc = createCategory({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1, name: 'test', parentId: 1 };
				await injectedFunc(info);

				sinon.assert.calledWith(spyCreate, info);
				sinon.assert.calledOnce(spyCreate);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyCreate = sinon.spy(CategoryModel, 'create');
			const injectedFunc = createCategory({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1, name: 'test', parentId: 1 };
				const result = await injectedFunc(info);

				deepStrictEqual(
					{
						accountBookId: result.accountBookId,
						name: result.name,
						parentId: result.parentId,
					},
					info,
				);

				const info2 = { accountBookId: 1, name: 'test' };
				const result2 = await injectedFunc(info2);

				deepStrictEqual(
					{
						accountBookId: result2.accountBookId,
						name: result2.name,
						parentId: result2.parentId,
					},
					{ ...info2, parentId: undefined },
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If accountBookId is not validated', async function () {
			spyCreate = sinon.spy(CategoryModel, 'create');
			const injectedFunc = createCategory({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 999909890, name: 'test', parentId: 1 };
				await injectedFunc(info);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(spyCreate);
			}
		});

		it('If create error', async function () {
			stubCreate = sinon.stub(CategoryModel, 'create');
			stubCreate.rejects(new Error('create error'));
			const injectedFunc = createCategory({ ...common, CategoryModel });

			try {
				const info = { accountBookId: 1, name: 'test', parentId: 1 };

				await injectedFunc(info);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubCreate);
			}
		});
	});

	describe('#createDefaultCategory', function () {
		let spyBulkCreate: sinon.SinonSpy<
			[
				records: readonly Optional<any, string>[],
				options?: BulkCreateOptions<any> | undefined,
			],
			Promise<Model<any, any>[]>
		>;

		it('Check function parameters', async function () {
			spyBulkCreate = sinon.spy(CategoryModel, 'bulkCreate');
			const injectedFunc = createDefaultCategory({
				...common,
				CategoryModel,
				defaultCategory,
			});

			try {
				const categoryList = defaultCategory.rootCategory.map(category => ({
					name: category.name,
					accountBookId: 1,
				}));
				await injectedFunc(1);

				sinon.assert.calledWith(spyBulkCreate, categoryList, {
					fields: ['name', 'accountBookId'],
					validate: true,
					transaction: undefined,
				});
				sinon.assert.calledTwice(spyBulkCreate);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyBulkCreate = sinon.spy(CategoryModel, 'bulkCreate');
			const injectedFunc = createDefaultCategory({
				...common,
				CategoryModel,
				defaultCategory,
			});

			try {
				await injectedFunc(1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If accountBookId is not validated', async function () {
			spyBulkCreate = sinon.spy(CategoryModel, 'bulkCreate');
			const injectedFunc = createDefaultCategory({
				...common,
				CategoryModel,
				defaultCategory,
			});

			try {
				await injectedFunc(909999999);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(spyBulkCreate);
			}
		});
	});

	describe('#updateCategory', function () {
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
			spyUpdate = sinon.spy(CategoryModel, 'update');
			const injectedFunc = updateCategory({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 1,
					id: 1,
					name: 'test',
				};
				await injectedFunc(info);

				const { name, ...where } = info;
				sinon.assert.calledWith(
					spyUpdate,
					{ name: info.name },
					{ where, transaction: undefined },
				);
				sinon.assert.calledOnce(spyUpdate);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyUpdate = sinon.spy(CategoryModel, 'update');
			const injectedFunc = updateCategory({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 1,
					id: 1,
					name: 'test222',
				};
				const result = await injectedFunc(info);

				if (result[0] === 0) {
					fail('Expected to error');
				}
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(spyUpdate);
			}
		});

		it('If accountBookId is not validated', async function () {
			spyUpdate = sinon.spy(CategoryModel, 'update');
			const injectedFunc = updateCategory({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 999999999,
					id: 1,
					name: 'test',
				};
				const result = await injectedFunc(info);

				if (result[0] === 1) {
					fail('Expected to error');
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If update error', async function () {
			stubUpdate = sinon.stub(CategoryModel, 'update');
			stubUpdate.rejects(new Error('update error'));

			const injectedFunc = updateCategory({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 1,
					id: 1,
					name: 'test14124',
					error: 'erorr',
				};
				await injectedFunc(info);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
			}
		});
	});

	describe('#deleteChildCategoryList', function () {
		let spyDestroy: sinon.SinonSpy<
			[options?: DestroyOptions<any> | undefined],
			Promise<number>
		>;

		let stubDestory: sinon.SinonStub<
			[options?: DestroyOptions<any> | undefined],
			Promise<number>
		>;

		it('Check function parameters', async function () {
			spyDestroy = sinon.spy(CategoryModel, 'destroy');
			const injectedFunc = deleteChildCategoryList({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 1,
					parentId: 1,
				};
				await injectedFunc(info);

				sinon.assert.calledWith(spyDestroy, { where: info, transaction: undefined });
				sinon.assert.calledOnce(spyDestroy);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyDestroy = sinon.spy(CategoryModel, 'destroy');
			const injectedFunc = deleteChildCategoryList({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 1,
					parentId: 3,
				};
				const result = await injectedFunc(info);

				if (result === 0) {
					fail('Expected to error');
				}
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(spyDestroy);
			}
		});

		it('If category is already deleted', async function () {
			spyDestroy = sinon.spy(CategoryModel, 'destroy');
			const injectedFunc = deleteChildCategoryList({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 1,
					parentId: 5,
				};
				await injectedFunc(info);
				const result = await injectedFunc(info);

				if (result > 0) {
					fail('Expected to error');
				}
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(spyDestroy);
			}
		});

		it('If accountBookId is not validated', async function () {
			spyDestroy = sinon.spy(CategoryModel, 'destroy');
			const injectedFunc = deleteChildCategoryList({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 999999999,
					parentId: 1,
				};
				const result = await injectedFunc(info);

				if (result > 0) {
					fail('Expected to error');
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If update error', async function () {
			stubDestory = sinon.stub(CategoryModel, 'destroy');
			stubDestory.rejects(new Error('update error'));

			const injectedFunc = deleteChildCategoryList({
				...common,
				CategoryModel,
			});

			try {
				const info = {
					accountBookId: 1,
					parentId: 1,
				};
				await injectedFunc(info);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
			}
		});
	});
});
