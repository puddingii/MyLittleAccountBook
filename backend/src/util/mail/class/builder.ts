import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

import Mailer from '.';
import { IMailerBuilder } from '@/interface/util/mailer';

class MailerBuilder implements IMailerBuilder {
	private defaultMailOptions: Mail.Options = {};
	private fromEmail = 'my_little_account_book@gmail.com';
	private mailContent: string = '';
	private transporter: Transporter<SMTPTransport.SentMessageInfo>;

	constructor(transporter: Transporter<SMTPTransport.SentMessageInfo>) {
		this.transporter = transporter;
	}

	build() {
		return new Mailer(this.transporter, {
			...this.defaultMailOptions,
			html: this.mailContent,
		});
	}

	setDefaultFromEmail() {
		this.defaultMailOptions = { ...this.defaultMailOptions, from: this.fromEmail };

		return this;
	}

	setDefaultMailOptions(options: Exclude<Mail.Options, 'html'>) {
		this.defaultMailOptions = options;

		return this;
	}

	setMailContent(mailContent: string) {
		this.mailContent = mailContent;

		return this;
	}
}

export default MailerBuilder;
