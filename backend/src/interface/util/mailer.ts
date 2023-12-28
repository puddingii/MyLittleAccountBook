import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface IMailerBuilder {
	build(): IMailer;
	/** from email을 my_little_account_book@gmail.com으로 설정 */
	setDefaultFromEmail(): this;
	/** Send 시 Mail Options 설정. HTML 설정은 setMailContent를 사용 */
	setDefaultMailOptions(options: Exclude<Mail.Options, 'html'>): this;
	/** Mail 내용으로 들어갈 HTML 설정 */
	setMailContent(mailContent: string): this;
}

export interface IMailer {
	/** Mail send. */
	sendMail(): Promise<SMTPTransport.SentMessageInfo>;
	/** Verify transporter. Always return true and if transporter is not verified, error will occur. */
	verify(): Promise<true>;
}
