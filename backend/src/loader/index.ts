import { Express } from 'express';

import expressLoader from './express';
import { testConnection as testMysqlConnection } from './mysql';
import { checkIsCustomError, convertErrorToCustomError } from '@/util/error';
import { logger } from '@/util';

export default async ({ app }: { app: Express }): Promise<void> => {
	try {
		await testMysqlConnection();
		expressLoader(app);

		logger.info('All loaders are loaded', ['Loader']);
	} catch (error) {
		if (checkIsCustomError(error)) {
			error.addTrace('Loader');
			throw error;
		}

		const customError = convertErrorToCustomError(error);
		throw customError;
	}
};
