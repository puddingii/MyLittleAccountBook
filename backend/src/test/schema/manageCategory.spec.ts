/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fail } from 'assert';
import sinon from 'sinon';
import { ParseParams } from 'zod';

import schema from '@/util/parser/schema';
import zParser from '@/util/parser';

describe('ManageCategory Zod Schema Test', function () {
	const manageCategorySchema = schema.manageCategory;

	describe('#getCategory', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				query: {
					accountBookId: string;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(manageCategorySchema.getCategory, 'parseAsync');
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
					zParser(manageCategorySchema.getCategory, { query: request }),
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
					zParser(manageCategorySchema.getCategory, { query: request }),
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

	describe('#postCategory', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					accountBookId: number;
					name: string;
					parentId?: number | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(manageCategorySchema.postCategory, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ accountBookId: 1, name: '', parentId: 1 },
					{ accountBookId: 1, name: '' },
					{ accountBookId: 1, name: 'adsf', parentId: 1 },
					{ accountBookId: 1, name: 'asdf' },
					{ accountBookId: 3333231, name: 'adsf', parentId: 1 },
					{ accountBookId: 3333231, name: 'asdf' },
				];

				requestList.forEach(request =>
					zParser(manageCategorySchema.postCategory, { body: request }),
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
					{ accountBookIds: 1, name: '', parentId: 1 },
					{ accountBookId: '1', name: '', parentId: 1 },
					{ accountBookId: {}, name: '', parentId: 1 },
					{ name: '', parentId: 1 },
					{ accountBookIds: 1, name: '' },
					{ accountBookId: 1, name: 1 },
					{ accountBookId: '1', name: '' },
					{ accountBookId: {}, name: '' },
					{ accountBookId: 1, name: {} },
					{ name: '' },
					{ accountBookId: 1, name: 1, parentId: 1 },
					{ accountBookId: 1, name: {}, parentId: 1 },
					{ accountBookId: 1, parentId: 1 },
					{ accountBookId: 1 },
					{ accountBookId: 1, name: '', parentId: {} },
					{ accountBookId: 1, name: '', parentId: '' },
				];

				requestList.forEach(request =>
					zParser(manageCategorySchema.postCategory, { body: request }),
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

	describe('#patchCategory', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					accountBookId: number;
					name: string;
					id: number;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(manageCategorySchema.patchCategory, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ accountBookId: 1, name: '', id: 1 },
					{ accountBookId: 1, name: 'adsf', id: 1 },
					{ accountBookId: 3333231, name: 'adsf', id: 1 },
				];

				requestList.forEach(request =>
					zParser(manageCategorySchema.patchCategory, { body: request }),
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
					{ accountBookId: 1, name: '', id: {} },
					{ accountBookId: 1, name: '', id: '' },
					{ accountBookId: 1, name: '' },
					{ accountBookId: 1, name: 1, id: 1 },
					{ accountBookId: 1, name: {}, id: 1 },
					{ accountBookId: 1, id: 1 },
					{ accountBookId: '', name: '', id: 1 },
					{ accountBookId: {}, name: '', id: 1 },
					{ name: '', id: 1 },
					{ accontBookId: 1, name: '' },
					{ name: '' },
					{ id: 1 },
					{},
				];

				requestList.forEach(request =>
					zParser(manageCategorySchema.postCategory, { body: request }),
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

	describe('#deleteCategory', function () {
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
			spyZParser = sinon.spy(manageCategorySchema.deleteCategory, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ accountBookId: '123123', id: '1' },
					{ accountBookId: 'a', id: '1' },
					{ accountBookId: '#@', id: '1' },
					{ accountBookId: '1', id: '1' },
					{ accountBookId: '123123', id: '1' },
					{ accountBookId: '123123', id: 'a' },
					{ accountBookId: '123123', id: '#@' },
					{ accountBookId: '1', id: '1' },
				];

				requestList.forEach(request =>
					zParser(manageCategorySchema.deleteCategory, { query: request }),
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
					{ accountBookId: '123123', id: 1 },
					{ accountBookId: '123123', id: {} },
					{ accountBookId: '123123' },
					{ accountBookId: {}, id: '1' },
					{ accountBookId: 1, id: '1' },
					{ id: '1' },
					{},
				];

				requestList.forEach(request =>
					zParser(manageCategorySchema.deleteCategory, { query: request }),
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
