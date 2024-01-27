/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import sinon from 'sinon';
import dayjs from 'dayjs';

/** Date util */
import DateUtil from '@/util/date';

describe('Date Util Test', function () {
	const curDate = dayjs().toDate();

	describe('#calculateNextCycle', function () {
		it('Check d', function () {
			try {
				const result = DateUtil.calculateNextCycle(curDate, 1, 'd');

				/** FIXME 테스트용 일부러 틀려놓음 */
				equal(curDate.getDate(), result.getDate());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check w', function () {
			try {
				const result = DateUtil.calculateNextCycle(curDate, 1, 'w');

				/** FIXME 테스트용 일부러 틀려놓음 */
				equal(curDate.getDate(), result.getDate());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check m', function () {
			try {
				const result = DateUtil.calculateNextCycle(curDate, 1, 'm');

				/** FIXME 테스트용 일부러 틀려놓음 */
				equal(curDate.getDate(), result.getDate());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check y', function () {
			try {
				const result = DateUtil.calculateNextCycle(curDate, 1, 'd');

				/** FIXME 테스트용 일부러 틀려놓음 */
				equal(curDate.getDate(), result.getDate());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check d', function () {
			try {
				const result = DateUtil.calculateNextCycle(curDate, 1, 'd');

				/** FIXME 테스트용 일부러 틀려놓음 */
				equal(curDate.getDate(), result.getDate());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check sd', function () {
			try {
				const result = DateUtil.calculateNextCycle(curDate, 1, 'sd');

				/** FIXME 테스트용 일부러 틀려놓음 */
				equal(curDate.getDate(), result.getDate());
			} catch (err) {
				fail(err as Error);
			}
		});
	});
});
