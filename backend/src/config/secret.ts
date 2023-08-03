import dotenv from 'dotenv';
import path from 'path';

const envPath =
	process.env.NODE_ENV === 'development' ? '../../.env.local' : '../../.env';
dotenv.config({ path: path.resolve(__dirname, envPath) });

export default {
	nodeEnv: process.env.NODE_ENV ?? '',
	loggerMode: process.env.LOGGER_MODE ?? 'prod',
	passwordHashRound: parseInt(process.env.PASSWORD_HASH_ROUND ?? '', 10),

	/** express key */
	express: {
		port: parseInt(process.env.EXPRESS_PORT ?? '', 10),
		corsOriginList: process.env.CORS_LIST?.split(',').map(origin => new RegExp(origin)),
		sessionKey: process.env.SESSION_KEY ?? '',
	},

	/** DB key */
	mysql: {
		host: process.env.MYSQL_HOST ?? '',
		username: process.env.MYSQL_USERNAME ?? '',
		pw: process.env.MYSQL_PW ?? '',
		databaseName: process.env.MYSQL_DATABASENAME ?? '',
	},
	redis: {
		host: process.env.REDIS_HOST ?? '',
		pw: process.env.REDIS_PW ?? '',
		port: parseInt(process.env.REDIS_PORT ?? '', 10),
	},

	/** Social Login Key */
	social: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID ?? '',
			secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
		},
		naver: {},
	},
};
