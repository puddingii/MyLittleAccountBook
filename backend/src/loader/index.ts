import { Express } from 'express';

/** Loaders */
import expressLoader from './express';
import { createTestAccount, sync as syncMySQL } from './mysql';
import { connect as connectRedis } from './redis';

/** ETC.. */
import { convertErrorToCustomError } from '@/util/error';
import { logger } from '@/util';
import secret from '@/config/secret';

export default async ({ app }: { app: Express }): Promise<void> => {
	try {
		await connectRedis();
		await syncMySQL();
		if (secret.nodeEnv === 'development') {
			await createTestAccount();
		}
		expressLoader(app);

		logger.info('All loaders are loaded', ['Loader']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Loader' });
		throw customError;
	}
};
