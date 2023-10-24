/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepStrictEqual, equal, fail } from 'assert';
import sinon from 'sinon';

import schema from '@/util/parser/schema';
import zParser from '@/util/parser';

describe('Group Service Test', function () {
	const userSchema = schema.user;
	let spyZParser = sinon.spy(zParser);

	beforeEach(function () {
		spyZParser = sinon.spy(zParser);
	});

	describe('#getUser', function () {
		it('Check correct result', async function () {
			try {
				await zParser(userSchema.getUser, {
					query: { email: 'test@naver.com', nickname: 'test' },
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check email', async function () {
			try {
				await zParser(userSchema.getUser, { query: { email: 'test@naver.com' } });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check nickname', async function () {
			try {
				await zParser(userSchema.getUser, { query: { nickname: 'test' } });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check object', async function () {
			try {
				await zParser(userSchema.getUser, { query: {} });
			} catch (err) {
				fail(err as Error);
			}
		});
	});
});
