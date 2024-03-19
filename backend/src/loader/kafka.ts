import { Admin, Consumer, Kafka, LogEntry, logLevel, type Producer } from 'kafkajs';
import { readFile } from 'fs/promises';
import path from 'path';

import secret from '@/config/secret';
import { IMAGE_TOPIC } from '@/enum';
import { logger } from '@/util';
import { convertErrorToCustomError } from '@/util/error';

const toWinstonLogLevel = (level: number) => {
	switch (level) {
		case logLevel.ERROR:
		case logLevel.NOTHING:
			return 'error';
		case logLevel.WARN:
			return 'warn';
		case logLevel.INFO:
			return 'info';
		case logLevel.DEBUG:
			return 'debug';
		default:
			return 'warn';
	}
};

const WinstonLogCreator = (logLevel: number) => {
	return ({ namespace, level, label, log }: LogEntry) => {
		const { timestamp, logger: _, message, ...extra } = log;
		logger.log(
			{
				level: toWinstonLogLevel(level),
				message: `[${namespace}] ${label} ${timestamp} ${message} ${JSON.stringify(
					extra,
				)}`,
			},
			['Kafka'],
		);
	};
};

export const kafka = new Kafka({
	clientId: 'my-app',
	brokers: ['localhost:9094'],
	logCreator: WinstonLogCreator,
});

export const admin = kafka.admin();
export const producer = kafka.producer();
export const consumer = kafka.consumer({
	groupId: 'my-little-accountbook',
	allowAutoTopicCreation: true,
});

export const setAdmin = async (admin: Admin) => {
	try {
		if (!secret.isKafkaAdminActivate) {
			return;
		}
		await admin.createTopics({ topics: [{ topic: IMAGE_TOPIC }] });
		await admin.disconnect();

		logger.info('Topic creation is successfully done.', ['Kafka']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Kafka' });
		throw customError;
	}
};

export const setProducer = async (producer: Producer) => {
	try {
		if (!secret.isKafkaProducerActivate) {
			return;
		}
		await producer.connect();

		logger.info('Producer connection has been established successfully.', ['Kafka']);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Kafka' });
		throw customError;
	}
};

export const setConsumer = async (consumer: Consumer) => {
	try {
		if (!secret.isKafkaConsumerActivate) {
			return;
		}
		await consumer.connect();
		await consumer.subscribe({ topic: IMAGE_TOPIC, fromBeginning: true });

		logger.info('Consumer connection has been established successfully.', ['Kafka']);

		await consumer.run({
			// eslint-disable-next-line require-await
			eachMessage: async ({ topic, partition, message }) => {
				console.log('consumer run: ', {
					topic,
					partition,
					value: message?.value?.toString(),
				});
			},
		});
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Kafka' });
		throw customError;
	}
};

export const pingpongTest = async (producer: Producer) => {
	const file = await readFile(path.resolve(__dirname, '../favicon.png'));
	const sendResult = await producer.send({
		topic: IMAGE_TOPIC,
		messages: [
			{ value: 'Hello KafkaJS user!', key: 's' },
			{ value: file, key: 'sa' },
		],
	});

	return sendResult;
};

export const closeConnection = async (...queue: (Producer | Consumer)[]) => {
	try {
		for await (const arg of queue) {
			await arg.disconnect();
			logger.info('Connection has been closed successfully', ['Kafka']);
		}
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Kafka' });
		throw customError;
	}
};
