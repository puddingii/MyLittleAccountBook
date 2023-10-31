/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepStrictEqual, fail } from 'assert';
import sinon from 'sinon';
import { CreateOptions, FindOptions, Model, Optional, UpdateOptions } from 'sequelize';

/** Repository */
import {
	createAccountBook,
	findOneAccountBook,
	updateAccountBook,
} from '@/repository/accountBookRepository';

/** Dependency */
import { errorUtil } from '../commonDependency';

/** Model */
import AccountBookModel from '@/model/accountBook';

describe('AccountBook Repository Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};

	describe('#findOneAccountBook', function () {
		let spyFindOne: sinon.SinonSpy<
			[options?: FindOptions<any> | undefined],
			Promise<Model<any, any> | null>
		>;

		beforeEach(function () {
			spyFindOne = sinon.spy(AccountBookModel, 'findOne');
		});

		it('Check function parameters', async function () {
			const injectedFunc = findOneAccountBook({ ...common, AccountBookModel });

			try {
				const info = { id: 1 };
				await injectedFunc(info);

				sinon.assert.calledOnce(spyFindOne);
				sinon.assert.calledWith(spyFindOne, { where: info });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			const injectedFunc = findOneAccountBook({ ...common, AccountBookModel });

			try {
				const accountBookInfo = {
					id: 1,
					title: 'title0',
					content: 'content0',
				};
				const info = { id: 1 };
				const result1 = await injectedFunc(info);
				const result2 = await injectedFunc({ title: '??' });

				deepStrictEqual(
					{ id: result1?.id, title: result1?.title, content: result1?.content },
					accountBookInfo,
				);
				deepStrictEqual(result2, null);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If where option error', async function () {
			const injectedFunc = findOneAccountBook({ ...common, AccountBookModel });

			try {
				const info = { error: 1, id: 1 };
				await injectedFunc(info);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(spyFindOne);
			}
		});
	});

	describe('#createAccountBook', function () {
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
			spyCreate = sinon.spy(AccountBookModel, 'create');
			const injectedFunc = createAccountBook({ ...common, AccountBookModel });

			try {
				const info = { title: 'title0', content: 'content0' };
				await injectedFunc(info);

				sinon.assert.calledOnce(spyCreate);
				sinon.assert.calledWith(spyCreate, info);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyCreate = sinon.spy(AccountBookModel, 'create');
			const injectedFunc = createAccountBook({ ...common, AccountBookModel });

			try {
				const accountBookInfo = {
					title: 'title0',
					content: 'content0',
				};
				const info = { title: 'title0', content: 'content0' };
				const result = await injectedFunc(info);

				deepStrictEqual(
					{ title: result?.title, content: result?.content },
					accountBookInfo,
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If create error', async function () {
			stubCreate = sinon.stub(AccountBookModel, 'create');
			stubCreate.rejects(new Error('create error'));

			const injectedFunc = createAccountBook({ ...common, AccountBookModel });

			try {
				const info = { title: 'title0' };
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

	describe('#updateAccountBook', function () {
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
			spyUpdate = sinon.spy(AccountBookModel, 'update');

			const injectedFunc = updateAccountBook({ ...common, AccountBookModel });

			try {
				const accountBookInfo = {
					title: 'faket0',
					content: 'fakec0',
				};
				const info = { ...accountBookInfo, accountBookId: 1 };
				await injectedFunc(info);

				sinon.assert.calledOnce(spyUpdate);
				sinon.assert.calledWith(spyUpdate, accountBookInfo, {
					where: { id: info.accountBookId },
					transaction: undefined,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			spyUpdate = sinon.spy(AccountBookModel, 'update');

			const injectedFunc = updateAccountBook({ ...common, AccountBookModel });

			try {
				const accountBookInfo = {
					title: 'faket0',
					content: 'fakec0',
				};
				const info = { ...accountBookInfo, accountBookId: 2 };
				const result = await injectedFunc(info);

				deepStrictEqual(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it("If update column that is not included from model's attributes is existed", async function () {
			spyUpdate = sinon.spy(AccountBookModel, 'update');

			const injectedFunc = updateAccountBook({ ...common, AccountBookModel });

			try {
				const accountBookInfo = {
					title: 'faket0',
					content: 'fakec0',
					error: '?',
				};
				const info = { ...accountBookInfo, accountBookId: 3 };
				const result = await injectedFunc(info);

				deepStrictEqual(result, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If update error', async function () {
			stubUpdate = sinon.stub(AccountBookModel, 'update');
			stubUpdate.rejects(new Error('update error'));

			const injectedFunc = updateAccountBook({ ...common, AccountBookModel });

			try {
				const accountBookInfo = {
					title: 'faket0',
					content: 'fakec0',
					error: '?',
				};
				const info = { ...accountBookInfo, accountBookId: 4 };
				await injectedFunc(info);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(spyUpdate);
			}
		});

		it('If where result count is 0', async function () {
			spyUpdate = sinon.spy(AccountBookModel, 'update');

			const injectedFunc = updateAccountBook({ ...common, AccountBookModel });

			try {
				const accountBookInfo = {
					title: 'faket0',
					content: 'fakec0',
					error: '?',
				};
				const info = { ...accountBookInfo, accountBookId: 23_123_123 };
				const result = await injectedFunc(info);

				deepStrictEqual(result, 0);
			} catch (err) {
				fail(err as Error);
			}
		});
	});
});
