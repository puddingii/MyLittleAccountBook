/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fail } from 'assert';
import sinon from 'sinon';
import { ParseParams } from 'zod';

import schema from '@/util/parser/schema';
import zParser from '@/util/parser';

describe('Group Zod Schema Test', function () {
	const groupSchema = schema.group;

	describe('#getList', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				query: {
					accountBookId: string;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(groupSchema.getList, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ accountBookId: '123123' },
					{ accountBookId: 'a' },
					{ accountBookId: '#@' },
					{ accountBookId: '1' },
				];
				requestList.forEach(request => zParser(groupSchema.getList, { query: request }));
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

				requestList.forEach(request => zParser(groupSchema.getList, { query: request }));
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

	describe('#addGroupUser', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					accountBookId: number;
					userEmail: string;
					userType: 'manager' | 'writer' | 'observer';
					accessHistory?: string | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(groupSchema.addGroupUser, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'manager',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{ userEmail: 'test@naver.com', userType: 'observer', accountBookId: 1 },
				];

				requestList.forEach(request =>
					zParser(groupSchema.addGroupUser, { body: request }),
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
					{
						userEmail: 'test@naver',
						userType: 'observer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'asdad.com',
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: {},
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 1,
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: '',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 1,
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: {},
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: {},
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: '1',
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: '1',
						accessHistory: {},
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: '1',
						accessHistory: 1,
					},
				];

				requestList.forEach(request =>
					zParser(groupSchema.addGroupUser, { body: request }),
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

	describe('#updateGroupUser', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					accountBookId: number;
					userEmail: string;
					userType: 'manager' | 'writer' | 'observer';
					accessHistory?: string | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(groupSchema.updateGroupUser, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'manager',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{ userEmail: 'test@naver.com', userType: 'observer', accountBookId: 1 },
				];

				requestList.forEach(request =>
					zParser(groupSchema.updateGroupUser, { body: request }),
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
					{
						userEmail: 'test@naver',
						userType: 'observer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'asdad.com',
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: {},
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 1,
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userType: 'writer',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: '',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 1,
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: {},
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						accountBookId: 1,
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: {},
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: '1',
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accessHistory: '2022-02-02',
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: '1',
						accessHistory: {},
					},
					{
						userEmail: 'test@naver.com',
						userType: 'observer',
						accountBookId: '1',
						accessHistory: 1,
					},
				];

				requestList.forEach(request =>
					zParser(groupSchema.updateGroupUser, { body: request }),
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

	describe('#deleteGroupUser', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				query: {
					accountBookId: string;
					id: string;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(groupSchema.deleteGroupUser, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ accountBookId: '1', id: '1' },
					{ accountBookId: 'asdf', id: '1' },
					{ accountBookId: '1', id: 'asdf' },
					{ accountBookId: 'asdf', id: 'asdf' },
				];

				requestList.forEach(request =>
					zParser(groupSchema.deleteGroupUser, { query: request }),
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
					{ accountBookId: '1', id: {} },
					{ accountBookId: '1', id: 1 },
					{ accountBookId: '1' },
					{ accountBookId: {}, id: 'asdf' },
					{ accountBookId: 1, id: 'asdf' },
					{ id: 'asdf' },
					{ accountBookId: 1, id: 1 },
					{},
				];

				requestList.forEach(request =>
					zParser(groupSchema.deleteGroupUser, { query: request }),
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

	describe('#validation', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				query: {
					accountBookId: string;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(groupSchema.validation, 'parseAsync');
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
					zParser(groupSchema.validation, { query: request }),
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
					zParser(groupSchema.validation, { query: request }),
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
