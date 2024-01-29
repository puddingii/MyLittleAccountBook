/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fail } from 'assert';
import sinon from 'sinon';
import { ParseParams } from 'zod';

import schema from '@/util/parser/schema';
import zParser from '@/util/parser';

describe('Header Zod Schema Test', function () {
	const headerSchema = schema.header;

	describe('#getAccountBook', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				query: {
					id?: string | undefined;
					title?: string | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(headerSchema.getAccountBook, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ id: '', title: '' },
					{ id: 'a', title: '' },
					{ id: '', title: 'a' },
					{ id: 'aa', title: 'aa' },
					{ id: 'aa' },
					{ title: 'aa' },
					{},
					{ asdf: '1' },
				];

				requestList.forEach(request =>
					zParser(headerSchema.getAccountBook, { query: request }),
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
					{ id: '', title: {} },
					{ id: '', title: 1 },
					{ id: {}, title: '' },
					{ id: 1, title: '' },
				];

				requestList.forEach(request =>
					zParser(headerSchema.getAccountBook, { query: request }),
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

	describe('#postAccountBook', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					title: string;
					invitedUserList: {
						type: 'manager' | 'writer' | 'observer';
						email: string;
					}[];
					content?: string | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(headerSchema.postAccountBook, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{
						title: '',
						content: '',
						invitedUserList: [{ email: 'test@naver.com', type: 'manager' }],
					},
					{ title: '', invitedUserList: [{ email: 'test@naver.com', type: 'manager' }] },
					{
						title: '',
						content: '',
						invitedUserList: [{ email: 'test@naver.com', type: 'writer' }],
					},
					{
						title: '',
						content: '',
						invitedUserList: [{ email: 'test@naver.com', type: 'observer' }],
					},
					{ title: '', content: '', invitedUserList: [] },
				];

				requestList.forEach(request =>
					zParser(headerSchema.postAccountBook, { body: request }),
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
						title: {},
						content: '',
						invitedUserList: [{ email: 'test@naver.com', type: 'manager' }],
					},
					{
						title: 1,
						content: '',
						invitedUserList: [{ email: 'test@naver.com', type: 'manager' }],
					},
					{
						title: '',
						content: {},
						invitedUserList: [{ email: 'test@naver.com', type: 'writer' }],
					},
					{
						title: '',
						content: 1,
						invitedUserList: [{ email: 'test@naver.com', type: 'writer' }],
					},
					{
						title: '',
						content: '',
						invitedUserList: [{ email: 'test@naver.com', type: '' }],
					},
					{
						title: '',
						content: '',
						invitedUserList: [{ email: 'test@naver.com', type: {} }],
					},
					{
						title: '',
						content: '',
						invitedUserList: [{ email: 'test@naver.com', type: 1 }],
					},
					{
						title: '',
						content: '',
						invitedUserList: [{ email: '123', type: 1 }],
					},
					{
						title: '',
						content: '',
						invitedUserList: [{ email: 'test@.', type: 1 }],
					},
				];

				requestList.forEach(request =>
					zParser(headerSchema.postAccountBook, { body: request }),
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

	describe('#patchAccountBook', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					accountBookId: number;
					title?: string | undefined;
					content?: string | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(headerSchema.patchAccountBook, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ title: '', content: '', accountBookId: 1 },
					{ title: '', content: '', accountBookId: 1, asdf: 1 },
					{ content: '', accountBookId: 1 },
					{ title: '', accountBookId: 1 },
					{ accountBookId: 1 },
				];

				requestList.forEach(request =>
					zParser(headerSchema.patchAccountBook, { body: request }),
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
					{ title: '', content: '', accountBookId: '1' },
					{ title: '', content: '', accountBookId: {} },
					{ title: '', content: 1, accountBookId: {} },
					{ title: '', content: {}, accountBookId: {} },
					{ title: 1, content: '', accountBookId: 1 },
					{ title: {}, content: '', accountBookId: 1 },
				];

				requestList.forEach(request =>
					zParser(headerSchema.patchAccountBook, { body: request }),
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
