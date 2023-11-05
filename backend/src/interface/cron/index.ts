import { findAllFixedColumnBasedCron } from '@/repository/cronGroupAccountBookRepository/dependency';
import { createNewColumn as createNewNFColumn } from '@/repository/groupAccountBookRepository/dependency';
import { logger } from '@/util';

/** Util */
import { TErrorUtil } from '../util';
import { calculateNextCycle } from '@/util/date';

export type TUpdateAllFixedColumn = {
	dependency: {
		logger: typeof logger;
		errorUtil: Pick<
			TErrorUtil,
			'convertErrorToCustomError' | 'filterPromiseSettledResultList'
		>;
		dateUtil: { calculateNextCycle: typeof calculateNextCycle };
		repository: {
			findAllFixedColumnBasedCron: typeof findAllFixedColumnBasedCron;
			createNewNFColumn: typeof createNewNFColumn;
		};
	};
};
