import express from 'express';

import secret from './config/secret';
import loader from './loader';
import { logger } from './util';
import { checkIsCustomError, convertErrorToCustomError } from './util/error';
import { ICustomError } from './util/error/class/interface';

const startServer = async () => {
	try {
		const app = express();

		await loader({ app });

		app.listen(secret.expressPort, () =>
			logger.info(
				`Connected the express server: http://localhost:${secret.expressPort}`,
				['Main'],
			),
		);
	} catch (error) {
		let customError = error;
		if (checkIsCustomError(customError)) {
			customError.addTrace('Root');
		} else {
			customError = convertErrorToCustomError(error, { trace: 'Root' });
		}

		logger.error(
			(customError as ICustomError).message,
			(customError as ICustomError).traceList,
		);
	}
};

startServer();
