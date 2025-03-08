import { Express, urlencoded, json } from 'express';
import morgan, { StreamOptions } from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swagger from 'swagger-ui-express';

import setRouter from '@/router';
import { logger } from '@/util';
import secret from '@/config/secret';

export default async (app: Express) => {
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
		const docs = await import('@/json/swagger.json');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		app.use('/dev/api/docs', swagger.serve, swagger.setup(docs));
	}

	setRouter(app);

	logger.info('Express server setting is done.', ['Express']);
};
