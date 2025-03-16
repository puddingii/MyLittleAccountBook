/** Service */

/** Utils */
import { logger } from '../util';
import { convertErrorToCustomError } from '../util/error';
import secret from '@/config/secret';
import TypeEmitter from './class';

/** Interface */
import { TImageEvent } from '@/interface/pubsub/image';

const eventEmitter = new TypeEmitter<TImageEvent>();

const baseErrorTraceList = ['PubSub', 'Image'];

const loggingEventResult = (
	status: { message: string; level: 'warn' | 'info' | 'error'; traceList: string[] },
	additionalMessage?: string,
) => {
	const { level, message, traceList } = status;
	logger[level](`${message} / detail- ${additionalMessage}`, traceList);
};

eventEmitter.on('upload', info => {
	const traceList = [...baseErrorTraceList, 'Upload'];
	const { buffer, id, name, path, beforeName, mimeType } = info;
	const statusManager = {
		1: {
			message: 'Get 1xx status response.',
			level: 'warn' as const,
		},
		2: {
			message: 'Success request.',
			level: 'info' as const,
		},
		3: { message: 'Get 3xx status response', level: 'warn' as const },
		4: {
			message: 'Client error.',
			level: 'error' as const,
		},
		5: {
			message: 'Image server error.',
			level: 'error' as const,
		},
	};

	try {
		const formData = new FormData();
		const blob = new Blob([buffer], { type: mimeType });
		formData.append('file', blob, name);
		formData.append('id', id);
		formData.append('path', path);
		if (beforeName) {
			formData.append('beforeName', beforeName);
		}

		fetch(`${secret.imageUrl}/image`, {
			method: 'POST',
			body: formData,
			signal: AbortSignal.timeout(10000),
		})
			.then(async res => {
				const flag = Math.floor(res.status / 100) as 1 | 2 | 3 | 4 | 5;

				let reason = '';
				if (flag === 4 || flag === 5) {
					const msgBody = (await res.json()) as {
						message: string;
						error: string;
						statusCode: number;
					};
					reason = msgBody?.message;
				}
				if (statusManager[flag]) {
					loggingEventResult(
						{ ...statusManager[flag], traceList },
						`${res.statusText}|${JSON.stringify({ id, name, path, reason })}`,
					);
				}
			})
			.catch(reason => {
				loggingEventResult(
					{
						message: JSON.stringify(reason) ?? 'Image upload request error',
						level: 'error',
						traceList,
					},
					JSON.stringify({ id, name, path }),
				);
			});
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, {
			trace: 'PubSub',
			code: 400,
		});
		logger.error(message, traceList);
	}
});

export default eventEmitter;
