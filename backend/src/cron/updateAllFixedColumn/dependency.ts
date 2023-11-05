import schedule from 'node-schedule';

import * as Logic from '.';

import { createNewColumn as createNewNFColumn } from '@/repository/groupAccountBookRepository/dependency';
import { findAllFixedColumnBasedCron } from '@/repository/cronGroupAccountBookRepository/dependency';

import { convertErrorToCustomError, filterPromiseSettledResultList } from '@/util/error';

import { calculateNextCycle } from '@/util/date';
import { logger } from '@/util';

try {
	/** 매일 0시마다 실행 */
	schedule.scheduleJob('0 0 * * *', async function () {
		await Logic.updateFixedAllColumn({
			dateUtil: { calculateNextCycle },
			errorUtil: { convertErrorToCustomError, filterPromiseSettledResultList },
			logger,
			repository: {
				createNewNFColumn,
				findAllFixedColumnBasedCron,
			},
		})();
	});
} catch (err) {
	console.log(err);
}
