/** Service */
import { sendVerificationEmail } from '@/service/common/user/dependency';

/** Utils */
import { logger } from '../util';
import { convertErrorToCustomError } from '../util/error';
import TypeEmitter from './class';

/** Interface */
import { TAuthEvent } from '@/interface/pubsub/auth';

const eventEmitter = new TypeEmitter<TAuthEvent>();

eventEmitter.on('join', async ({ email, nickname }) => {
	try {
		/** Mail Send(Verify email) */
		await sendVerificationEmail({ userEmail: email, userNickname: nickname });
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, {
			trace: 'PubSub',
			code: 400,
		});
		logger.error(message, traceList);
	}
});

export default eventEmitter;
