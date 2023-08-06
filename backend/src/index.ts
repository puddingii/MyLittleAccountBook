import express from 'express';

import secret from './config/secret';
import loader from './loader';
import { logger } from './util';
import { convertErrorToCustomError } from './util/error';

const startServer = async () => {
	try {
		const app = express();

		await loader({ app });

		app.listen(secret.express.port, () =>
			logger.info(
				`Connected the express server: http://localhost:${secret.express.port}`,
				['Main'],
			),
		);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, { trace: 'Root' });
		logger.error(message, traceList);
	}
};

startServer();
