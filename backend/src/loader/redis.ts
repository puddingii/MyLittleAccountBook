import { createClient } from 'redis';

import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import secret from '@/config/secret';

const client = createClient({
	password: secret.redis.pw,
	socket: {
		host: secret.redis.host,
		port: secret.redis.port,
	},
});

export const connect = async () => {
	try {
		client.on('error', err => {
			const customError = convertErrorToCustomError(err, { trace: 'Redis' });
			logger.error(customError.message, customError.traceList);
		});
		await client.connect();

		logger.info('Connection has been established successfully.', ['Redis']);
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
