import dotenv from 'dotenv';
import path from 'path';

const envPathMapper = {
	development: path.resolve(__dirname, '../../.env.local'),
	test: path.resolve(__dirname, '../../.env.local'),
	production: path.resolve(__dirname, '../../.env'),
	developmentDocker: path.resolve(__dirname, '../../.env.development'),
};

type TEnv = keyof typeof envPathMapper;

const envPath = envPathMapper[process.env.NODE_ENV as TEnv];
dotenv.config({ path: envPath });

const dbNameInfo = {
	production: '',
	development: '_dev',
	test: '_test',
	developmentDocker: '_dev',
} satisfies Record<TEnv, string>;

export default {
	nodeEnv: (process.env.NODE_ENV ?? 'development') as TEnv,
	loggerMode: process.env.LOGGER_MODE ?? 'prod',
	passwordHashRound: parseInt(process.env.PASSWORD_HASH_ROUND ?? '', 10),
	baseUrl: process.env.BASE_URL ?? '',
	frontUrl: process.env.FRONT_URL ?? '',
	imageUrl: process.env.IMAGE_URL ?? '',
	superUser: process.env.SUPER_ACCOUNT ?? '',
	isCronActivate: process.env.IS_CRON_ACTIVATE === 'Y',
	isKafkaAdminActivate: process.env.IS_KAFKA_ADMIN_ACTIVATE === 'Y',
	isKafkaProducerActivate: process.env.IS_KAFKA_PRODUCER_ACTIVATE === 'Y',
	isKafkaConsumerActivate: process.env.IS_KAFKA_CONSUMER_ACTIVATE === 'Y',

	/** express key */
	express: {
		port: parseInt(process.env.EXPRESS_PORT ?? '', 10),
		corsOriginList: process.env.CORS_LIST?.split(',').map(origin => new RegExp(origin)),
		sessionKey: process.env.SESSION_KEY ?? '',
		jwtSecureKey: process.env.JWT_SECURE_KEY ?? '',
		jwtRefreshTokenTime: parseInt(process.env.JWT_REFRESH_TOKEN_TIME ?? '', 10),
		jwtAccessTokenTime: parseInt(process.env.JWT_ACCESS_TOKEN_TIME ?? '', 10),
		isMaster: process.env.IS_MASTER_SERVER === 'Y',
	},

	/** Socket key */
	socket: {
		port: parseInt(process.env.SOCKET_PORT ?? '', 10),
		corsOriginList: process.env.SOCKET_CORS_LIST?.split(',').map(
			origin => new RegExp(origin),
		),
	},

	/** DB key */
	mysql: {
		dumpPath: process.env.MYSQL_DUMP_PATH ?? '',
		master: {
			host: process.env.MYSQL_MASTER_HOST ?? '',
			username: process.env.MYSQL_MASTER_USERNAME ?? '',
			pw: process.env.MYSQL_MASTER_PW ?? '',
			port: parseInt(process.env.MYSQL_MASTER_PORT ?? '3306', 10),
		},
		slave1: {
			host: process.env.MYSQL_SLAVE1_HOST ?? '',
			username: process.env.MYSQL_SLAVE1_USERNAME ?? '',
			pw: process.env.MYSQL_SLAVE1_PW ?? '',
			port: process.env.MYSQL_SLAVE1_PORT ?? '',
		},
		local: {
			host: process.env.MYSQL_HOST ?? '',
			username: process.env.MYSQL_USERNAME ?? '',
			pw: process.env.MYSQL_PW ?? '',
			port: 13306,
		},
		cmdPw: process.env.MYSQL_COMMAND_PW ?? '',
		databaseName: `${process.env.MYSQL_DATABASENAME}${
			dbNameInfo[(process.env.NODE_ENV ?? 'development') as TEnv]
		}`,
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
		naver: {
			clientId: process.env.NAVER_CLIENT_ID ?? '',
			secret: process.env.NAVER_CLIENT_SECRET ?? '',
		},
	},

	/** Mail Auth */
	mailer: {
		host: process.env.MAILER_HOST,
		user: process.env.MAILER_USER,
		pw: process.env.MAILER_PW,
	},

	/** Kafka */
	kafka: {
		clientId: process.env.KAFKA_CLIENT_ID ?? '',
		brokerList: process.env.KAFKA_BROKER_LIST?.split(',') ?? [],
		consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID ?? '',
	},
};
