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
		return dayjs(date).set('date', cycleTime).toDate();
	}

	return dayjs(date)
		.add(CYCLE_TYPE_MAPPER[cycleType] * cycleTime, 'day')
		.toDate();
};
