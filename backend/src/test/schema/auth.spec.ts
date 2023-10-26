/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fail } from 'assert';
import sinon from 'sinon';
import { ParseParams } from 'zod';

import schema from '@/util/parser/schema';
import zParser from '@/util/parser';

describe('Auth Zod Schema Test', function () {
	const authSchema = schema.auth;

	describe('#socialLogin', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				query: {
					type: 'Naver' | 'Google';
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(authSchema.socialLogin, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [{ type: 'Naver' }, { type: 'Google' }];

				requestList.forEach(request =>
					zParser(authSchema.socialLogin, { query: request }),
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
				const requestList = [{ type: '' }, { type: {} }, { type: 1 }];

				requestList.forEach(request =>
					zParser(authSchema.socialLogin, { query: request }),
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

	describe('#googleLogin', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					state: string;
					error?: string | undefined;
					code?: string | undefined;
					authuser?: string | undefined;
					scope?: string | undefined;
					prompt?: string | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(authSchema.googleLogin, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ error: '', code: '', state: '', authuser: '', scope: '', prompt: '' },
					{ code: '', state: '', authuser: '', scope: '', prompt: '' },
					{ error: '', state: '', authuser: '', scope: '', prompt: '' },
					{ error: '', code: '', state: '', scope: '', prompt: '' },
					{ error: '', code: '', state: '', authuser: '', prompt: '' },
					{ error: '', code: '', state: '', authuser: '', scope: '' },
					{ error: '', code: '', state: '', authuser: '' },
					{ error: '', code: '', state: '' },
					{ error: '', state: '' },
					{ state: '' },
				];

				requestList.forEach(request =>
					zParser(authSchema.googleLogin, { body: request }),
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
					{ error: '', code: '', state: {}, authuser: '', scope: '', prompt: '' },
					{ error: '', code: '', state: 1, authuser: '', scope: '', prompt: '' },
					{ error: '', code: '', authuser: '', scope: '', prompt: '' },
					{},
				];

				requestList.forEach(request =>
					zParser(authSchema.googleLogin, { body: request }),
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

	describe('#naverLogin', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					state: string;
					code?: string | undefined;
					error?: string | undefined;
					error_description?: string | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(authSchema.naverLogin, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ code: '', state: '', error: '', error_description: '' },
					{ code: '', state: '', error: '' },
					{ code: '', state: '' },
					{ state: '' },
				];

				requestList.forEach(request => zParser(authSchema.naverLogin, { body: request }));
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
					{ code: '', state: 1, error: '', error_description: '' },
					{ code: '', state: {}, error: '', error_description: '' },
					{ code: '', error: '', error_description: '' },
					{},
				];

				requestList.forEach(request => zParser(authSchema.naverLogin, { body: request }));
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

	describe('#emailLogin', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					email: string;
					password: string;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(authSchema.emailLogin, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ email: 'test@naver.com', password: '' },
					{ email: 'test@naver.asd', password: '' },
					{ email: 's@dfs.com', password: 'asd!#@sda22AA' },
				];

				requestList.forEach(request => zParser(authSchema.emailLogin, { body: request }));
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
						email: 'test@naver',
						password: '',
					},
					{
						email: 'asdad.com',
						password: '',
					},
					{
						email: {},
						password: '',
					},
					{
						email: 1,
						password: '',
					},
					{
						password: '',
					},
					{
						email: 'test@naver.com',
						password: 1,
					},
					{
						email: 'test@naver.com',
						password: {},
					},
					{
						email: 'test@naver.com',
					},
				];

				requestList.forEach(request => zParser(authSchema.emailLogin, { body: request }));
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

	describe('#join', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					email: string;
					password: string;
					nickname: string;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(authSchema.join, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{ email: 'test@naver.com', password: 'asdf!@#12AS', nickname: '' },
					{ email: 'test@naver.asd', password: '!@#asdf12AS', nickname: '' },
					{ email: 's@dfs.com', password: '12AS!@#asd', nickname: '' },
					{ email: 's@dfs.com', password: '12!@#ASasd', nickname: '' },
					{ email: 's@dfs.com', password: '12ASasd!@#', nickname: '' },
				];

				requestList.forEach(request => zParser(authSchema.join, { body: request }));
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
					{ email: 'test@naver', password: '12AS!@#asd', nickname: '' },
					{ email: 'asdad.com', password: '12AS!@#asd', nickname: '' },
					{ email: {}, password: '12AS!@#asd', nickname: '' },
					{ email: 1, password: '12AS!@#asd', nickname: '' },
					{ password: '12AS!@#asd', nickname: '' },
					{ email: 'test@naver.com', password: 1, nickname: '' },
					{ email: 'test@naver.com', password: {}, nickname: '' },
					{ email: 'test@naver.com', password: '', nickname: '' },
					{ email: 'test@naver.com', password: '12312312', nickname: '' },
					{ email: 'test@naver.com', password: '1231231A', nickname: '' },
					{ email: 'test@naver.com', password: '123123aA', nickname: '' },
					{ email: 'test@naver.com', password: '123123##', nickname: '' },
					{ email: 'test@naver.com', password: '123123aA', nickname: '' },
					{ email: 'test@naver.com', nickname: '' },
					{ email: 'test@naver.com', password: '12AS!@#asd', nickname: 1 },
					{ email: 'test@naver.com', password: '12AS!@#asd', nickname: {} },
					{ email: 'test@naver.com', password: '12AS!@#asd' },
					{ password: '12AS!@#asd' },
					{ email: 'test@naver.com' },
					{ nickname: '' },
				];

				requestList.forEach(request => zParser(authSchema.join, { body: request }));
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

	describe('#tokenInfo', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				headers: {
					refresh: string;
					authorization: string;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(authSchema.tokenInfo, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{
						refresh: 'refreshtoken',
						authorization: 'Bearer accesstoken',
					},
					{
						refresh: '',
						authorization: 'Bearer 1',
					},
					{
						refresh: 'refreshtoken',
						authorization: 'Bearer',
					},
					{
						refresh: '',
						authorization: 'Bearer',
					},
				];

				requestList.forEach(request =>
					zParser(authSchema.tokenInfo, { headers: request }),
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
						refresh: 2,
						authorization: 'Bearer 1',
					},
					{
						refresh: {},
						authorization: 'Bearer 1',
					},
					{
						authorization: 'Bearer 1',
					},
					{
						refresh: 'refreshtoken',
						authorization: 'Bearerr 333',
					},
					{
						refresh: 'refreshtoken',
						authorization: 'Bearer333',
					},
					{
						refresh: 'refreshtoken',
						authorization: '',
					},
					{
						refresh: 'refreshtoken',
						authorization: {},
					},
					{
						refresh: 'refreshtoken',
						authorization: 111,
					},
					{
						refresh: 'refreshtoken',
					},
				];

				requestList.forEach(request =>
					zParser(authSchema.tokenInfo, { headers: request }),
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
