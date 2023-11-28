import dayjs from 'dayjs';
import { curry, map, pipe } from '@fxts/core';

import { TCycleType, TEveryOfType, TDate } from '@/interface/user';

const CYCLE_TYPE_MAPPER = {
	d: 1,
	w: 7,
	m: 30,
	y: 365,
};

/** Dayjs 객체 리턴 */
export const coverDayjs = curry((date: TDate) => {
	return dayjs.isDayjs(date) ? date : dayjs(date);
});

/** date값을 Date형식으로 변경 */
export const toDate = curry((date: TDate) => pipe(date, coverDayjs).toDate());

/** 현재 날짜를 Date형식으로 반환 */
export const getCurrentDate = curry(() => toDate(undefined));

/** date를 String으로 변경 */
export const toString = curry((date: TDate) => pipe(date, coverDayjs).toString());

/** 해당 월의 첫 번째 날 리턴 */
export const getFirstDayOfMonth = curry((date: TDate) =>
	pipe(date, coverDayjs).startOf('month'),
);

/** 해당 월의 마지막 날 리턴 */
export const getEndDayOfMonth = curry((date: TDate) =>
	pipe(date, coverDayjs).endOf('month'),
);

/**
 * Type에 따른 날짜 값 변경
 * @example
 * // type: 'year' - 년 변경
 * // type: 'month' - 월 변경
 * // type: 'date' - 일 변경
 * const date = setDate('month', 12, '2022-02-02')
 * console.log(date) // 2022-12-02
 */
export const setDate = curry((type: dayjs.UnitType, value: number, date: TDate) =>
	pipe(date, coverDayjs).set(type, value),
);

/**
 * Type에 따른 날짜 값 더하기
 * @example
 * // type: 'year' - 연도 부분 더하기
 * // type: 'month' - 월 부분 더하기
 * // type: 'day' - 일 부분 더하기
 * const date = addDate('year', 4, '2022-02-02')
 * console.log(date) // 2026-02-02
 */
export const addDate = curry((type: dayjs.ManipulateType, value: number, date: TDate) =>
	pipe(date, coverDayjs).add(value, type),
);

/**
 * Type에 따른 날짜 값 빼기
 * @example
 * // type: 'year' - 연도 부분 빼기
 * // type: 'month' - 월 부분 빼기
 * // type: 'day' - 일 부분 빼기
 * const date = subtractDate('year', 4, '2022-02-02')
 * console.log(date) // 2018-02-02
 */
export const subtractDate = curry(
	(type: dayjs.ManipulateType, value: number, date: TDate) =>
		pipe(date, coverDayjs).subtract(value, type),
);

/**
 * CycleType에 해당하는 'n일'과 cnt를 곱해서 리턴.
 * @example
 *
 */
export const getCycleDay = curry(
	(type: TEveryOfType, cnt: number) => CYCLE_TYPE_MAPPER[type] * cnt,
);

/**
 * a가 b보다 큰 날짜인지(a > b)
 */
export const isGreater = curry((a: TDate, b: TDate) => {
	const [aDate, bDate] = pipe([a, b], map(coverDayjs));

	return !aDate.isSame(bDate, 'day') && aDate.isAfter(bDate, 'day');
});

/**
 * a가 b이상 날짜인지(a >= b)
 */
export const isGreaterOrEqual = curry((a: TDate, b: TDate) => {
	const [aDate, bDate] = pipe([a, b], map(coverDayjs));

	return aDate.isSame(bDate, 'day') && aDate.isAfter(bDate, 'day');
});

/**
 * a가 b보다 작은 날짜인지(a < b)
 */
export const isLess = curry((a: TDate, b: TDate) => {
	const [aDate, bDate] = pipe([a, b], map(coverDayjs));

	return !aDate.isSame(bDate, 'day') && aDate.isBefore(bDate, 'day');
});

/**
 * a가 b이하 날짜인지(a <= b)
 */
export const isLessOrEqual = curry((a: TDate, b: TDate) => {
	const [aDate, bDate] = pipe([a, b], map(coverDayjs));

	return aDate.isSame(bDate, 'day') && aDate.isBefore(bDate, 'day');
});

/** 다음 업데이트될 날짜를 계산하는 함수 */
export const calculateNextCycle = (
	date: Date,
	cycleTime: number,
	cycleType: TCycleType,
) => {
	const curDate = coverDayjs(date);

	/** '특정 일'의 경우 */
	if (cycleType === 'sd') {
		return pipe(
			curDate,
			setDate('month', curDate.month() + 1),
			setDate('date', cycleTime),
			toDate,
		);
	}

	/** 'n일 마다'의 경우 */
	return pipe(curDate, addDate('day', getCycleDay(cycleType, cycleTime)), toDate);
};

export default {
	addDate,
	calculateNextCycle,
	coverDayjs,
	getCurrentDate,
	getCycleDay,
	getEndDayOfMonth,
	getFirstDayOfMonth,
	setDate,
	subtractDate,
	toDate,
	toString,
};
