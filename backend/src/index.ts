import express from 'express';

import secret from './config/secret';
import loader from './loader';
import { logger } from './util';

const startServer = async () => {
	const app = express();

	await loader({ app });

	app.listen(secret.expressPort, () =>
		logger.info(`Connected the express server: http://localhost:${secret.expressPort}`, [
			'Main',
		]),
	);
};

startServer();
