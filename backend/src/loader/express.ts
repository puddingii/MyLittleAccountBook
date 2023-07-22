import { Express, urlencoded, json } from 'express';
import morgan, { StreamOptions } from 'morgan';
import cors from 'cors';
// import passport from 'passport';
import cookieParser from 'cookie-parser';

import setRouter from '@/router';
import { logger } from '@/util';
import secret from '@/config/secret';

export default (app: Express) => {
	const stream: StreamOptions = {
		// Use the http severity
		write: message => logger.info(message, ['Express']),
	};
	app.use(
		morgan(':method :url :status :res[content-length] - :response-time ms', {
			stream,
		}),
	);
	app.use(cors({ origin: secret.corsOriginList, credentials: true }));
	app.use(cookieParser(secret.sessionKey));
	app.use(urlencoded({ extended: false }));
	app.use(json());

	setRouter(app);
};
