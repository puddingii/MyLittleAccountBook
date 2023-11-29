import { Express } from 'express';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

/** Loaders */
import expressLoader from './express';
import { sync as syncMySQL } from './mysql';
import { connect as connectRedis } from './redis';
import { connect as connectSocket } from './socket';

/** ETC.. */
import { convertErrorToCustomError } from '@/util/error';
import { logger } from '@/util';
import loadCron from './cron';

export default async ({ app }: { app: Express }): Promise<void> => {
	try {
		dayjs.extend(utc);
		dayjs.extend(timezone);
		dayjs.tz.setDefault('Asia/Seoul');
		await connectRedis();
		await syncMySQL();
		expressLoader(app);
		await connectSocket();
		await loadCron();

		logger.info('All loaders are loaded', ['Loader']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Loader' });
		throw customError;
	}
};
