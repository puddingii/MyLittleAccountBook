/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { fail } from 'assert';
import sinon from 'sinon';
import { ParseParams } from 'zod';

import schema from '@/util/parser/schema';
import zParser from '@/util/parser';

describe('Group Service Test', function () {
	const userSchema = schema.user;

	describe('#getUser', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				query: {
					email?: string | undefined;
					nickname?: string | undefined;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(schema.user.getUser, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{},
					{ email: 'test@naver.com' },
					{ nickname: 'test' },
					{ email: 'test@naver.com', nickname: 'test' },
					{ email: 'test@naver.asd', nickname: 'test' },
					{ email: 'aBBAA@naver.asd' },
					{ nickname: 'test' },
					{ email: 'aBBAA@naver.asd', nickname: 'test' },
				];

				requestList.forEach(request => zParser(userSchema.getUser, { query: request }));
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
					{ email: 'test.com', nickname: 'test' },
					{ email: 'testcom', nickname: 'test' },
					{ email: 'test@test', nickname: 'test' },
					{ email: 'test!ejr.com', nickname: 'test' },
					{ email: 'test@!@#!', nickname: 'test' },
					{ email: 'test@222', nickname: 'test' },
					{ email: 'test@222com', nickname: 'test' },
				];

				requestList.forEach(request => zParser(userSchema.getUser, { query: request }));
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

	describe('#patchUser', function () {
		let spyZParser: sinon.SinonSpy<
			[data: unknown, params?: Partial<ParseParams> | undefined],
			Promise<{
				body: {
					nickname: string;
				};
				headers: {
					refresh: string;
					authorization: string;
				};
			}>
		>;

		beforeEach(function () {
			spyZParser = sinon.spy(schema.user.patchUser, 'parseAsync');
		});

		it('Check correct', async function () {
			try {
				const requestList = [
					{
						body: { nickname: 'test' },
						headers: { refresh: 'refreshtoken', authorization: 'Bearer accesstoken' },
					},
					{
						body: { nickname: 't122te' },
						headers: { refresh: '', authorization: 'Bearer 1' },
					},
					{
						body: { nickname: '331tw' },
						headers: { refresh: 'refreshtoken', authorization: 'Bearer' },
					},
					{
						body: { nickname: 'test' },
						headers: { refresh: '', authorization: 'Bearer' },
					},
				];

				requestList.forEach(request => zParser(userSchema.patchUser, request));
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
						body: { nickname2: 'test' },
						headers: { refresh: 'refreshtoken', authorization: 'Bearer accesstoken' },
					},
					{
						body: { nickname: 2 },
						headers: { refresh: 'refreshtoken', authorization: 'Bearer accesstoken' },
					},
					{
						body: { nickname: {} },
						headers: { refresh: 'refreshtoken', authorization: 'Bearer accesstoken' },
					},
					{
						headers: { refresh: 'refreshtoken', authorization: 'Bearer accesstoken' },
					},
					{
						body: { nickname: '2' },
						headers: { refresh: 2, authorization: 'Bearer 1' },
					},
					{
						body: { nickname: '2' },
						headers: { refresh: {}, authorization: 'Bearer 1' },
					},
					{
						body: { nickname: '2' },
						headers: { authorization: 'Bearer 1' },
					},
					{
						body: { nickname: 'asdf' },
						headers: { refresh: 'refreshtoken', authorization: 'Bearerr 333' },
					},
					{
						body: { nickname: 'asdf' },
						headers: { refresh: 'refreshtoken', authorization: 'Bearer333' },
					},
					{
						body: { nickname: 'asdf' },
						headers: { refresh: 'refreshtoken', authorization: '' },
					},
					{
						body: { nickname: 'asdf' },
						headers: { refresh: 'refreshtoken', authorization: {} },
					},
					{
						body: { nickname: 'asdf' },
						headers: { refresh: 'refreshtoken', authorization: 111 },
					},
					{
						body: { nickname: 'asdf' },
						headers: { refresh: 'refreshtoken' },
					},
				];

				requestList.forEach(request => zParser(userSchema.patchUser, request));
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
