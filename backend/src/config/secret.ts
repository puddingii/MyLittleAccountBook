import dotenv from 'dotenv';
import path from 'path';

const envPath =
	process.env.NODE_ENV === 'development' ? '../../.env.local' : '../../.env';
dotenv.config({ path: path.resolve(__dirname, envPath) });

export default {
	nodeEnv: process.env.NODE_ENV ?? '',
	loggerMode: process.env.LOGGER_MODE ?? 'prod',
	/** express key */
	expressPort: parseInt(process.env.EXPRESS_PORT ?? '', 10),
	sessionKey: process.env.SESSION_KEY ?? '',
	passwordHashRound: parseInt(process.env.PASSWORD_HASH_ROUND ?? '', 10),
	corsOriginList: process.env.CORS_LIST?.split(',').map(origin => new RegExp(origin)),
	/** DB key */
	mysqlUsername: process.env.MYSQL_USERNAME ?? '',
	mysqlPw: process.env.MYSQL_PW ?? '',
	mysqlDatabaseName: process.env.MYSQL_DATABASENAME ?? '',
	mysqlHost: process.env.MYSQL_HOST ?? '',
};
