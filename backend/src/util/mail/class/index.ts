import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { IMailer } from '@/interface/util/mailer';

export default class Mailer implements IMailer {
	private defaultMailOptions: Mail.Options;
	private transporter: Transporter<SMTPTransport.SentMessageInfo>;
	constructor(
		transporter: Transporter<SMTPTransport.SentMessageInfo>,
		defaultMailOptions: Mail.Options,
	) {
		this.transporter = transporter;
		this.defaultMailOptions = defaultMailOptions;
	}

	sendMail() {
		return this.transporter.sendMail(this.defaultMailOptions);
	}

	verify() {
		return this.transporter.verify();
	}
}
