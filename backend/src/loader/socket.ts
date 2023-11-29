import { each, pipe } from '@fxts/core';
import { Server } from 'socket.io';
import { RedisClientType, createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';
import secret from '@/config/secret';

import {
	ClientToServerEvents,
	InterServerEvents,
	ServerToClientEvents,
	SocketData,
} from '@/interface/socket';

const { corsOriginList, port } = secret.socket;

const PUB_CLIENT_NAME = 'PUB_CLIENT';
const SUB_CLIENT_NAME = 'SUB_CLIENT';

const pubClient = createClient({
	password: secret.redis.pw,
	socket: {
		host: secret.redis.host,
		port: secret.redis.port,
	},
	name: PUB_CLIENT_NAME,
});
const subClient = pubClient.duplicate({ name: SUB_CLIENT_NAME });

export const io = new Server<
	ServerToClientEvents,
	ClientToServerEvents,
	InterServerEvents,
	SocketData
>({
	cors: { credentials: true, origin: corsOriginList },
});

const setDefaultEvent = (client: RedisClientType, name: string) => {
	client.on('connect', () =>
		logger.info(`${name}'s connection has been established successfully.`, ['Socket']),
	);
	client.on('error', err => {
		const customError = convertErrorToCustomError(err, { trace: 'Socket' });
		logger.error(`${name}${customError.message}`, customError.traceList);
	});
};

export const connect = async () => {
	pipe(
		[
			[pubClient, PUB_CLIENT_NAME],
			[subClient, SUB_CLIENT_NAME],
		] as Array<[RedisClientType, string]>,
		each(([client, name]) => setDefaultEvent(client, name)),
	);

	await Promise.all([pubClient.connect(), subClient.connect()]);

	io.adapter(createAdapter(pubClient, subClient));
	io.listen(port);

	logger.info('Socket server setting is done.', ['Socket']);
};
