/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import dayjs from 'dayjs';

/** Date util */
import DateUtil from '@/util/date';

describe('Date Util Test', function () {
	const curDate = dayjs('2024-01-01').toDate();

	describe('#calculateNextCycle(2024year: 366days)', function () {
		it('Check d(date result <= endDate, calculateNextNotSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(1, 'd', curDate);

				equal(result.getDate(), 2);
				equal(result.getMonth(), 0);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check d(result result > endDate, calculateNextNotSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(31, 'd', curDate);

				equal(result.getDate(), 1);
				equal(result.getMonth(), 1);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check w(date result <= endDate, calculateNextNotSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(1, 'w', curDate);

				equal(result.getDate(), 8);
				equal(result.getMonth(), 0);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check w(date result > endDate, calculateNextNotSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(5, 'w', curDate);

				equal(result.getDate(), 5);
				equal(result.getMonth(), 1);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check m(date result <= endDate, calculateNextNotSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(1, 'm', curDate);

				equal(result.getDate(), 31);
				equal(result.getMonth(), 0);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check m(date result > endDate, calculateNextNotSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(2, 'm', curDate);

				equal(result.getDate(), 1);
				equal(result.getMonth(), 2);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check y(date result <= endDate, calculateNextNotSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(1, 'y', curDate);

				equal(result.getDate(), 31);
				equal(result.getMonth(), 11);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check y(date result > endDate, calculateNextNotSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(2, 'y', curDate);

				equal(result.getDate(), 31);
				equal(result.getMonth(), 11);
				equal(result.getFullYear(), 2025);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check sd(date result <= endDate, calculateNextSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(1, 'sd', curDate);

				equal(result.getDate(), 1);
				equal(result.getMonth(), 1);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check sd(date === cycleDate, calculateNextSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(1, 'sd', curDate);

				equal(result.getDate(), 1);
				equal(result.getMonth(), 1);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check sd(date !== cycleDate, calculateNextSD)', function () {
			try {
				const result = DateUtil.calculateNextCycle(28, 'sd', curDate);

				equal(result.getDate(), 28);
				equal(result.getMonth(), 1);
				equal(result.getFullYear(), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If cycleTime is minus, calculateNextSD', function () {
			try {
				DateUtil.calculateNextCycle(-1, 'sd', curDate);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				ok(true);
			}
		});
	});

	describe('#isLessOrEqual', function () {
		it('2024-01-01 <= 2024-01-02', function () {
			try {
				const result = DateUtil.isLessOrEqual('2024-01-01', '2024-01-02');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-02 <= 2024-01-01', function () {
			try {
				const result = DateUtil.isLessOrEqual('2024-01-02', '2024-01-01');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 <= 2025-01-01', function () {
			try {
				const result = DateUtil.isLessOrEqual('2024-01-01', '2025-01-01');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 <= 2024-01-01', function () {
			try {
				const result = DateUtil.isLessOrEqual('2024-01-01', '2024-01-01');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-02-01 <= 2024-01-02', function () {
			try {
				const result = DateUtil.isLessOrEqual('2024-02-01', '2024-01-02');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2025-01-01 <= 2024-01-02', function () {
			try {
				const result = DateUtil.isLessOrEqual('2025-01-01', '2024-01-02');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#isLess', function () {
		it('2024-01-01 < 2024-01-02', function () {
			try {
				const result = DateUtil.isLess('2024-01-01', '2024-01-02');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-02 < 2024-01-01', function () {
			try {
				const result = DateUtil.isLess('2024-01-02', '2024-01-01');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 < 2025-01-01', function () {
			try {
				const result = DateUtil.isLess('2024-01-01', '2025-01-01');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 < 2024-01-01', function () {
			try {
				const result = DateUtil.isLess('2024-01-01', '2024-01-01');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-02-01 < 2024-01-02', function () {
			try {
				const result = DateUtil.isLess('2024-02-01', '2024-01-02');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2025-01-01 < 2024-01-02', function () {
			try {
				const result = DateUtil.isLess('2025-01-01', '2024-01-02');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#isGreaterOrEqual', function () {
		it('2024-01-01 >= 2024-01-02', function () {
			try {
				const result = DateUtil.isGreaterOrEqual('2024-01-01', '2024-01-02');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-02 >= 2024-01-01', function () {
			try {
				const result = DateUtil.isGreaterOrEqual('2024-01-02', '2024-01-01');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 >= 2025-01-01', function () {
			try {
				const result = DateUtil.isGreaterOrEqual('2024-01-01', '2025-01-01');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 >= 2024-01-01', function () {
			try {
				const result = DateUtil.isGreaterOrEqual('2024-01-01', '2024-01-01');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-02-01 >= 2024-01-02', function () {
			try {
				const result = DateUtil.isGreaterOrEqual('2024-02-01', '2024-01-02');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2025-01-01 >= 2024-01-02', function () {
			try {
				const result = DateUtil.isGreaterOrEqual('2025-01-01', '2024-01-02');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#isGreater', function () {
		it('2024-01-01 > 2024-01-02', function () {
			try {
				const result = DateUtil.isGreater('2024-01-01', '2024-01-02');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-02 > 2024-01-01', function () {
			try {
				const result = DateUtil.isGreater('2024-01-02', '2024-01-01');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 > 2025-01-01', function () {
			try {
				const result = DateUtil.isGreater('2024-01-01', '2025-01-01');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 > 2024-01-01', function () {
			try {
				const result = DateUtil.isGreater('2024-01-01', '2024-01-01');

				equal(result, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-02-01 > 2024-01-02', function () {
			try {
				const result = DateUtil.isGreater('2024-02-01', '2024-01-02');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2025-01-01 > 2024-01-02', function () {
			try {
				const result = DateUtil.isGreater('2025-01-01', '2024-01-02');

				equal(result, true);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#getCycleDay', function () {
		it('d * 2', function () {
			try {
				const result = DateUtil.getCycleDay('d', 2);

				equal(result, 2);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('w * 2', function () {
			try {
				const result = DateUtil.getCycleDay('w', 2);

				equal(result, 14);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('m * 2', function () {
			try {
				const result = DateUtil.getCycleDay('m', 2);

				equal(result, 60);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('y * 2', function () {
			try {
				const result = DateUtil.getCycleDay('y', 2);

				equal(result, 730);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#subtractDate', function () {
		it('2024-01-01 - 2year', function () {
			try {
				const result = DateUtil.subtractDate('year', 2, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 0);
				equal(result.get('year'), 2022);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 - 2month', function () {
			try {
				const result = DateUtil.subtractDate('month', 2, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 10);
				equal(result.get('year'), 2023);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 - 13month', function () {
			try {
				const result = DateUtil.subtractDate('month', 13, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 11);
				equal(result.get('year'), 2022);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 - 2date', function () {
			try {
				const result = DateUtil.subtractDate('d', 2, curDate);

				equal(result.get('date'), 30);
				equal(result.get('month'), 11);
				equal(result.get('year'), 2023);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 - 32date', function () {
			try {
				const result = DateUtil.subtractDate('d', 32, curDate);

				equal(result.get('date'), 30);
				equal(result.get('month'), 10);
				equal(result.get('year'), 2023);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#addDate', function () {
		it('2024-01-01 + 2year', function () {
			try {
				const result = DateUtil.addDate('year', 2, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 0);
				equal(result.get('year'), 2026);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 + 2month', function () {
			try {
				const result = DateUtil.addDate('month', 2, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 2);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 + 13month', function () {
			try {
				const result = DateUtil.addDate('month', 13, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 1);
				equal(result.get('year'), 2025);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 + 2date', function () {
			try {
				const result = DateUtil.addDate('d', 2, curDate);

				equal(result.get('date'), 3);
				equal(result.get('month'), 0);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 + 32date', function () {
			try {
				const result = DateUtil.addDate('d', 32, curDate);

				equal(result.get('date'), 2);
				equal(result.get('month'), 1);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#setDate', function () {
		it('2024-01-01 >>> 2025-01-01(year)', function () {
			try {
				const result = DateUtil.setDate('year', 2025, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 0);
				equal(result.get('year'), 2025);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 >>> 2024-05-01(month)', function () {
			try {
				const result = DateUtil.setDate('month', 4, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 4);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 >>> 2025-01-01(month)', function () {
			try {
				const result = DateUtil.setDate('month', 12, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 0);
				equal(result.get('year'), 2025);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 >>> 2024-01-22(date)', function () {
			try {
				const result = DateUtil.setDate('d', 22, curDate);

				equal(result.get('date'), 22);
				equal(result.get('month'), 0);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-01-01 >>> 2024-02-01(date)', function () {
			try {
				const result = DateUtil.setDate('d', 32, curDate);

				equal(result.get('date'), 1);
				equal(result.get('month'), 1);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#getEndDayOfMonth', function () {
		it('2024-01 end day of month', function () {
			try {
				const result = DateUtil.getEndDayOfMonth('2024-01-15');

				equal(result.get('date'), 31);
				equal(result.get('month'), 0);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-02 end day of month', function () {
			try {
				const result = DateUtil.getEndDayOfMonth('2024-02-15');

				equal(result.get('date'), 29);
				equal(result.get('month'), 1);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#getFirstDayOfMonth', function () {
		it('2024-01 first day of month', function () {
			try {
				const result = DateUtil.getFirstDayOfMonth('2024-01-15');

				equal(result.get('date'), 1);
				equal(result.get('month'), 0);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('2024-02 first day of month', function () {
			try {
				const result = DateUtil.getFirstDayOfMonth('2024-02-15');

				equal(result.get('date'), 1);
				equal(result.get('month'), 1);
				equal(result.get('year'), 2024);
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#toString', function () {
		it('string to string', function () {
			try {
				const result = DateUtil.toString('2024-01-01');

				equal(result, curDate.toUTCString());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('dayjs to string', function () {
			try {
				const result = DateUtil.toString(dayjs(curDate));

				equal(result, curDate.toUTCString());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Date to string', function () {
			try {
				const result = DateUtil.toString(new Date(curDate));

				equal(result, curDate.toUTCString());
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#getCurrentDate', function () {
		it('Check now date', function () {
			try {
				const result = DateUtil.getCurrentDate();

				const nowDate = new Date();
				equal(result.getDate(), nowDate.getDate());
				equal(result.getMonth(), nowDate.getMonth());
				equal(result.getFullYear(), nowDate.getFullYear());
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#toDate', function () {
		const resultDate = dayjs('2024-01-01').toDate();
		it('string to toDate', function () {
			try {
				const result = DateUtil.toDate('2024-01-01');

				equal(result.toUTCString(), resultDate.toUTCString());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('dayjs to toDate', function () {
			try {
				const result = DateUtil.toDate(dayjs(curDate));

				equal(result.toUTCString(), resultDate.toUTCString());
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Date to toDate', function () {
			try {
				const result = DateUtil.toDate(new Date(curDate));

				equal(result.toUTCString(), resultDate.toUTCString());
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#coverDayjs', function () {
		it('string to dayjs', function () {
			try {
				const result = DateUtil.coverDayjs('2024-01-01');

				equal(dayjs.isDayjs(result), true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('dayjs to dayjs', function () {
			try {
				const result = DateUtil.coverDayjs(dayjs(curDate));

				equal(dayjs.isDayjs(result), true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Date to dayjs', function () {
			try {
				const result = DateUtil.coverDayjs(new Date(curDate));

				equal(dayjs.isDayjs(result), true);
			} catch (err) {
				fail(err as Error);
			}
		});
	});
});
