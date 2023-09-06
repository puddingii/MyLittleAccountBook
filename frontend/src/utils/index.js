import dayjs from 'dayjs';

export const setComma = num => {
	if (!num) {
		return '0';
	}
	return Math.floor(Number(num))
		.toString()
		.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
};

const CYCLE_TYPE_INFO = {
	sd: '매월',
	d: '일 마다',
	w: '주 마다',
	m: '월(30일) 마다',
	y: '년 마다',
};
/**
 * @param {'sd' |'d'|'w'|'m'|'y'} type
 * @param {number} time
 */
export const formatCycle = (type, time) => {
	if (type === 'sd') {
		return `${CYCLE_TYPE_INFO[type]} ${time}마다`;
	}
	return `${time}${CYCLE_TYPE_INFO[type]}`;
};

export const calculateNextCycle = (date, cycleTime, cycleType) => {
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
