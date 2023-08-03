import { Express } from 'express';

import expressLoader from './express';
import { sync as syncMySQL } from './mysql';
import { connect as connectRedis } from './redis';
import { convertErrorToCustomError } from '@/util/error';
import { logger } from '@/util';

export default async ({ app }: { app: Express }): Promise<void> => {
	try {
		await connectRedis();
		await syncMySQL();
		expressLoader(app);

		logger.info('All loaders are loaded', ['Loader']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Loader' });
		throw customError;
	}
};
