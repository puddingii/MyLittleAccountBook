import dayjs from 'dayjs';

import { TCycleType } from '@/interface/user';

const CYCLE_TYPE_MAPPER = {
	d: 1,
	w: 7,
	m: 30,
	y: 365,
};

export const calculateNextCycle = (
	date: Date,
	cycleTime: number,
	cycleType: TCycleType,
) => {
	/** '특정 일'의 경우 */
	if (cycleType === 'sd') {
		const curDate = dayjs(date);
		return curDate
			.set('month', curDate.month() + 1)
			.set('date', cycleTime)
			.toDate();
	}

	/** 'n일 마다'의 경우 */
	return dayjs(date)
		.add(CYCLE_TYPE_MAPPER[cycleType] * cycleTime, 'day')
		.toDate();
};
