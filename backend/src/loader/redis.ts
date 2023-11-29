import { createClient } from 'redis';

import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import secret from '@/config/secret';

const CLIENT_NAME = 'CACHE_CLIENT';

const client = createClient({
	password: secret.redis.pw,
	socket: {
		host: secret.redis.host,
		port: secret.redis.port,
	},
	name: CLIENT_NAME,
});

export const connect = async () => {
	try {
		client.on('error', err => {
			const customError = convertErrorToCustomError(err, { trace: 'Redis' });
			logger.error(`${CLIENT_NAME}${customError.message}`, customError.traceList);
		});
		client.on('connect', () => {
			logger.info(`${CLIENT_NAME}'s connection has been established successfully.`, [
				'Redis',
			]);
		});
		await client.connect();
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Redis',
		});
		throw customError;
	}
};

export const closeConnection = async () => {
	try {
		await client.disconnect();
		logger.info('Connection has been closed successfully.', ['Redis']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Redis' });
		throw customError;
	}
};

export default client;
