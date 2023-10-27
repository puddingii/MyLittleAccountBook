/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fail } from 'assert';
import sinon from 'sinon';
import { ParseParams } from 'zod';

import schema from '@/util/parser/schema';
import zParser from '@/util/parser';
import {
	TDeleteColumnQuery,
	TGetCategoryQuery,
	TGetColumnListQuery,
	TGetSummaryQuery,
	TPatchColumnQuery,
	TPatchFixedColumnQuery,
	TPatchNotFixedColumnQuery,
	TPostColumnQuery,
	TPostFixedColumnQuery,
	TPostNotFixedColumnQuery,
} from '@/util/parser/schema/accountBookSchema';

describe('AccountBook Zod Schema Test', function () {
	const accountBookSchema = schema.accountBook;

	describe('#getCategory', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<TGetCategoryQuery>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(accountBookSchema.getCategory, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ accountBookId: '123123' },
					{ accountBookId: 'a' },
					{ accountBookId: '#@' },
					{ accountBookId: '1' },
				];

				requestList.forEach(request =>
					zParser(accountBookSchema.getCategory, { query: request }),
				);
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const rejectedIdx = resultList.findIndex(result => result.status === 'rejected');
				if (rejectedIdx > -1) {
					throw new Error(
						`index: ${rejectedIdx} - ${
							(resultList[rejectedIdx] as PromiseRejectedResult).reason
						}`,
					);
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check wrong', async function () {
			try {
				const requestList = [{ accountBookId: 1 }, { accountBookId: {} }, {}];

				requestList.forEach(request =>
					zParser(accountBookSchema.getCategory, { query: request }),
				);
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const fulfilledIdx = resultList.findIndex(
					result => result.status === 'fulfilled',
				);
				if (fulfilledIdx > -1) {
					throw new Error(`index: ${fulfilledIdx} is error`);
				}
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#postColumn', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<TPostColumnQuery>
		>;
		const curDate = new Date().toISOString();
		const nextDatee = new Date();
		nextDatee.setDate(nextDatee.getDate() + 1);
		const nextDate = nextDatee.toISOString();

		beforeEach(function () {
			spyZParser = sinon.spy(accountBookSchema.postColumn, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						type: 'income',
						value: 1,
						writeType: 'f',
						content: '',
					} as TPostFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						type: 'income',
						value: 1,
						writeType: 'f',
					} as TPostFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPostFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'm',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPostFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'sd',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPostFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'w',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPostFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'y',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPostFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						type: 'spending',
						value: 1,
						writeType: 'nf',
						spendingAndIncomeDate: nextDate,
						content: '',
					} as TPostNotFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						type: 'income',
						value: 1,
						writeType: 'nf',
						spendingAndIncomeDate: nextDate,
						content: '',
					} as TPostNotFixedColumnQuery,
					{
						accountBookId: 1,
						category: 1,
						type: 'income',
						value: 1,
						writeType: 'nf',
						spendingAndIncomeDate: nextDate,
					} as TPostNotFixedColumnQuery,
				];

				requestList.forEach(request => zParser(accountBookSchema.postColumn, request));
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const rejectedIdx = resultList.findIndex(result => result.status === 'rejected');
				if (rejectedIdx > -1) {
					throw new Error(
						`index: ${rejectedIdx} - ${
							(resultList[rejectedIdx] as PromiseRejectedResult).reason
						}`,
					);
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check wrong', async function () {
			try {
				const defaultInfo = {
					accountBookId: 1,
					category: 1,
					cycleTime: 1,
					cycleType: 'y',
					needToUpdateDate: nextDate,
					type: 'spending',
					value: 1,
					writeType: 'f',
				};
				const requestList = [
					{
						...defaultInfo,
						accountBookId: {},
					},
					{
						...defaultInfo,
						accountBookId: '1',
					},
					{
						category: 1,
						cycleTime: 1,
						cycleType: 'y',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						...defaultInfo,
						category: '1',
					},
					{
						...defaultInfo,
						category: {},
					},
					{
						accountBookId: 1,
						cycleTime: 1,
						cycleType: 'y',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						...defaultInfo,
						cycleTime: {},
					},
					{
						...defaultInfo,
						category: 1,
						cycleTime: '1',
					},
					{
						...defaultInfo,
						cycleTime: 30,
						cycleType: 'sd',
					},
					{
						...defaultInfo,
						cycleTime: 388,
						cycleType: 'd',
					},
					{
						accountBookId: 1,
						category: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						...defaultInfo,
						needToUpdateDate: curDate,
					},
					{
						...defaultInfo,
						needToUpdateDate: '1',
					},
					{
						...defaultInfo,
						needToUpdateDate: 1,
					},
					{
						...defaultInfo,
						needToUpdateDate: {},
					},
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'd',
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						...defaultInfo,
						type: '',
					},
					{
						...defaultInfo,
						type: {},
					},
					{
						...defaultInfo,
						type: 1,
					},
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						value: 1,
						writeType: 'f',
					},
					{
						...defaultInfo,
						value: '1',
					},
					{
						...defaultInfo,
						value: {},
					},
					{
						...defaultInfo,
						content: {},
					},
					{
						...defaultInfo,
						content: 1,
					},
				];

				requestList.forEach(request => zParser(accountBookSchema.postColumn, request));
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const fulfilledIdx = resultList.findIndex(
					result => result.status === 'fulfilled',
				);
				if (fulfilledIdx > -1) {
					throw new Error(`index: ${fulfilledIdx} is error`);
				}
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#patchColumn', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<TPatchColumnQuery>
		>;
		const curDate = new Date().toISOString();
		const nextDatee = new Date();
		nextDatee.setDate(nextDatee.getDate() + 1);
		const nextDate = nextDatee.toISOString();

		beforeEach(function () {
			spyZParser = sinon.spy(accountBookSchema.patchColumn, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						type: 'income',
						value: 1,
						writeType: 'f',
						content: '',
					} as TPatchFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						type: 'income',
						value: 1,
						writeType: 'f',
					} as TPatchFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPatchFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'm',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPatchFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'sd',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPatchFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'w',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPatchFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'y',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					} as TPatchFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						type: 'spending',
						value: 1,
						writeType: 'nf',
						spendingAndIncomeDate: nextDate,
						content: '',
					} as TPatchNotFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						type: 'income',
						value: 1,
						writeType: 'nf',
						spendingAndIncomeDate: nextDate,
						content: '',
					} as TPatchNotFixedColumnQuery,
					{
						accountBookId: 1,
						gabId: 1,
						category: 1,
						type: 'income',
						value: 1,
						writeType: 'nf',
						spendingAndIncomeDate: nextDate,
					} as TPatchNotFixedColumnQuery,
				];

				requestList.forEach(request => zParser(accountBookSchema.patchColumn, request));
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const rejectedIdx = resultList.findIndex(result => result.status === 'rejected');
				if (rejectedIdx > -1) {
					throw new Error(
						`index: ${rejectedIdx} - ${
							(resultList[rejectedIdx] as PromiseRejectedResult).reason
						}`,
					);
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check wrong', async function () {
			try {
				const defaultInfo = {
					accountBookId: 1,
					category: 1,
					cycleTime: 1,
					cycleType: 'y',
					needToUpdateDate: nextDate,
					type: 'spending',
					value: 1,
					writeType: 'f',
					gabId: 1,
				};
				const requestList = [
					{
						...defaultInfo,
						accountBookId: {},
					},
					{
						...defaultInfo,
						accountBookId: '1',
					},
					{
						gabId: 1,
						category: 1,
						cycleTime: 1,
						cycleType: 'y',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						...defaultInfo,
						category: '1',
					},
					{
						...defaultInfo,
						category: {},
					},
					{
						gabId: 1,
						accountBookId: 1,
						cycleTime: '1',
						cycleType: 'y',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						...defaultInfo,
						cycleTime: {},
					},
					{
						...defaultInfo,
						category: 1,
						cycleTime: '1',
					},
					{
						...defaultInfo,
						cycleTime: 30,
						cycleType: 'sd',
					},
					{
						...defaultInfo,
						cycleTime: 388,
						cycleType: 'd',
					},
					{
						gabId: 1,
						accountBookId: 1,
						category: 1,
						cycleType: 'd',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						...defaultInfo,
						needToUpdateDate: curDate,
					},
					{
						...defaultInfo,
						needToUpdateDate: '1',
					},
					{
						...defaultInfo,
						needToUpdateDate: 1,
					},
					{
						...defaultInfo,
						needToUpdateDate: {},
					},
					{
						...defaultInfo,
						type: '',
					},
					{
						...defaultInfo,
						type: {},
					},
					{
						...defaultInfo,
						type: 1,
					},
					{
						...defaultInfo,
						value: '1',
					},
					{
						...defaultInfo,
						value: {},
					},
					{
						...defaultInfo,
						content: {},
					},
					{
						...defaultInfo,
						content: 1,
					},
					{
						gabId: 1,
						accountBookId: 1,
						category: 1,
						cycleType: 'y',
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{ ...defaultInfo, gabId: '1' },
					{ ...defaultInfo, gabId: {} },
					{
						gabId: 1,
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						gabId: {},
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						gabId: '1',
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
					{
						accountBookId: 1,
						category: 1,
						cycleTime: 1,
						needToUpdateDate: nextDate,
						type: 'spending',
						value: 1,
						writeType: 'f',
					},
				];

				requestList.forEach(request => zParser(accountBookSchema.patchColumn, request));
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const fulfilledIdx = resultList.findIndex(
					result => result.status === 'fulfilled',
				);
				if (fulfilledIdx > -1) {
					throw new Error(`index: ${fulfilledIdx} is error`);
				}
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#getColumnList', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<TGetColumnListQuery>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(accountBookSchema.getColumnList, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ accountBookId: '1', startDate: '2022-02-02', endDate: '2002-02-02' },
					{ accountBookId: '1qwe', startDate: '2022-02-02', endDate: '2002-02-02' },
				];

				requestList.forEach(request =>
					zParser(accountBookSchema.getColumnList, { query: request }),
				);
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const rejectedIdx = resultList.findIndex(result => result.status === 'rejected');
				if (rejectedIdx > -1) {
					throw new Error(
						`index: ${rejectedIdx} - ${
							(resultList[rejectedIdx] as PromiseRejectedResult).reason
						}`,
					);
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check wrong', async function () {
			try {
				const requestList = [
					{ accountBookId: 1, startDate: '2022-02-02', endDate: '2002-02-02' },
					{ accountBookId: {}, startDate: '2022-02-02', endDate: '2002-02-02' },
					{ startDate: '2022-02-02', endDate: '2002-02-02' },
					{ accountBookId: '1', startDate: {}, endDate: '2002-02-02' },
					{ accountBookId: '1', startDate: 1, endDate: '2002-02-02' },
					{ accountBookId: '1', endDate: '2002-02-02' },
					{ accountBookId: '1', startDate: '2022-02-02', endDate: {} },
					{ accountBookId: '1', startDate: '2022-02-02', endDate: 1 },
					{ accountBookId: '1', startDate: '2022-02-02' },
					{ accountBookId: '1' },
					{ startDate: '2022-02-02' },
					{ endDate: '2022-02-02' },
					{},
				];

				requestList.forEach(request =>
					zParser(accountBookSchema.getColumnList, { query: request }),
				);
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const fulfilledIdx = resultList.findIndex(
					result => result.status === 'fulfilled',
				);
				if (fulfilledIdx > -1) {
					throw new Error(`index: ${fulfilledIdx} is error`);
				}
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#deleteColumn', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<TDeleteColumnQuery>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(accountBookSchema.deleteColumn, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ id: '1', writeType: 'nf' },
					{ id: '1', writeType: 'f' },
					{ id: '1qwe', writeType: 'nf' },
					{ id: '1qwe', writeType: 'f' },
				];

				requestList.forEach(request =>
					zParser(accountBookSchema.deleteColumn, { query: request }),
				);
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const rejectedIdx = resultList.findIndex(result => result.status === 'rejected');
				if (rejectedIdx > -1) {
					throw new Error(
						`index: ${rejectedIdx} - ${
							(resultList[rejectedIdx] as PromiseRejectedResult).reason
						}`,
					);
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check wrong', async function () {
			try {
				const requestList = [
					{ id: '1', writeType: 'a' },
					{ id: '1', writeType: '' },
					{ id: '1', writeType: {} },
					{ id: '1', writeType: 1 },
					{ id: '1' },
					{ id: 1, writeType: 'nf' },
					{ id: {}, writeType: 'nf' },
					{ writeType: 'nf' },
					{},
				];

				requestList.forEach(request =>
					zParser(accountBookSchema.deleteColumn, { query: request }),
				);
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const fulfilledIdx = resultList.findIndex(
					result => result.status === 'fulfilled',
				);
				if (fulfilledIdx > -1) {
					throw new Error(`index: ${fulfilledIdx} is error`);
				}
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#getSummary', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<TGetSummaryQuery>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(accountBookSchema.getSummary, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ accountBookId: '123123' },
					{ accountBookId: 'a' },
					{ accountBookId: '#@' },
					{ accountBookId: '1' },
				];

				requestList.forEach(request =>
					zParser(accountBookSchema.getSummary, { query: request }),
				);
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const rejectedIdx = resultList.findIndex(result => result.status === 'rejected');
				if (rejectedIdx > -1) {
					throw new Error(
						`index: ${rejectedIdx} - ${
							(resultList[rejectedIdx] as PromiseRejectedResult).reason
						}`,
					);
				}
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check wrong', async function () {
			try {
				const requestList = [{ accountBookId: 1 }, { accountBookId: {} }, {}];

				requestList.forEach(request =>
					zParser(accountBookSchema.getSummary, { query: request }),
				);
				const resultList = await Promise.allSettled(
					spyZParser.getCalls().map(call => call.returnValue),
				);

				const fulfilledIdx = resultList.findIndex(
					result => result.status === 'fulfilled',
				);
				if (fulfilledIdx > -1) {
					throw new Error(`index: ${fulfilledIdx} is error`);
				}
			} catch (err) {
				fail(err as Error);
			}
		});
	});
});
