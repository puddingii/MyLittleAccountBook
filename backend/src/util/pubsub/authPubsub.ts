import { nanoid } from 'nanoid/async';

/** Utils */
import { logger } from '..';
import { setEmailVerificationStateCache } from '../cache/v2';
import { convertErrorToCustomError } from '../error';
import { getBuilder } from '../mail';
import { getVerifyMailHTML } from '../mail/html';
import TypeEmitter from './class';
import secret from '@/config/secret';

/** Interface */
import { TAuthEvent } from '@/interface/pubsub/auth';

const eventEmitter = new TypeEmitter<TAuthEvent>();

eventEmitter.on('join', async ({ email, nickname }) => {
	try {
		/** Mail Send(Verify email) */
		const randomState = await nanoid(15);
		const verifyEmailHref = `${secret.frontUrl}/verify?state=${randomState}`;
		await setEmailVerificationStateCache(randomState, 1, 600);

		const mailerBuilder = getBuilder();
		const mailer = mailerBuilder
			.setDefaultFromEmail()
			.setDefaultMailOptions({ to: email, subject: '나의_작은_가계부 메일인증' })
			.setMailContent(getVerifyMailHTML(verifyEmailHref, nickname))
			.build();

		await mailer.sendMail();
	} catch (error) {
		const { message, traceList } = convertErrorToCustomError(error, {
			trace: 'PubSub',
			code: 400,
		});
		logger.error(message, traceList);
	}
});

export default eventEmitter;
