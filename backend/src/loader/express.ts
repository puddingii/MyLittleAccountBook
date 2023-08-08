import { Express, urlencoded, json, static as expressStatic } from 'express';
import morgan, { StreamOptions } from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import setRouter from '@/router';
import { logger } from '@/util';
import secret from '@/config/secret';

export default (app: Express) => {
	const { corsOriginList, sessionKey } = secret.express;
	const stream: StreamOptions = {
		// Use the http severity
		write: message => logger.info(message, ['Express']),
	};
	app.use(
		morgan(':method :url :status :res[content-length] - :response-time ms', {
			stream,
		}),
	);
	app.use(cors({ origin: corsOriginList, credentials: true }));
	app.use(cookieParser(sessionKey));
	app.use(urlencoded({ extended: false }));
	app.use(json());
	if (secret.nodeEnv === 'development') {
		app.use('/static', expressStatic(path.join(__dirname, '../../public')));
	}

	setRouter(app);

	logger.info('Express server setting is done.', ['Express']);
};
