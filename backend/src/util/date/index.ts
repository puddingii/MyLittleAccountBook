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
	if (cycleType === 'sd') {
		const curDate = dayjs(date);
		if (curDate.date() >= cycleTime) {
			curDate.set('month', curDate.month() + 1);
		}
		return curDate.set('date', cycleTime).toDate();
	}

	return dayjs(date)
		.add(CYCLE_TYPE_MAPPER[cycleType] * cycleTime, 'day')
		.toDate();
};
