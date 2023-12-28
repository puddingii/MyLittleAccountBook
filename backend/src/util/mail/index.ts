import nodemailer from 'nodemailer';

import secret from '@/config/secret';
import MailerBuilder from './class/builder';

const {
	mailer: { pw: pass, user, host },
} = secret;

const transporter = nodemailer.createTransport({
	port: 587,
	host,
	auth: { user, pass },
});

export const getBuilder = () => {
	return new MailerBuilder(transporter);
};
