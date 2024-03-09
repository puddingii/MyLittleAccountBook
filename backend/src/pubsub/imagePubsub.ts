import FormData from 'form-data';
/** Service */

/** Utils */
import fetch from 'node-fetch';
import { logger } from '../util';
import { convertErrorToCustomError } from '../util/error';
import TypeEmitter from './class';

/** Interface */
import { TImageEvent } from '@/interface/pubsub/image';
import secret from '@/config/secret';

const eventEmitter = new TypeEmitter<TImageEvent>();

eventEmitter.on('upload', async info => {
	const { stream, id, name, path } = info;

	try {
		const formData = new FormData();
		formData.append('file', stream);
		formData.append('id', id);
		formData.append('name', name);
		formData.append('path', path);

		const a = await fetch(`${secret.imageUrl}/image`, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			method: 'post',
			body: formData,
		});
		console.log(a);
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, {
			trace: 'PubSub',
			code: 400,
		});
		logger.error(message, traceList);
	}
});

export default eventEmitter;
