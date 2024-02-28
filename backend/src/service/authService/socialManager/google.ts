import { google } from 'googleapis';

import { ISocialManager } from '@/interface/auth';

import secret from '@/config/secret';
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

const {
	social: { google: googleKey },
	frontUrl,
} = secret;

export default class GoogleManager implements ISocialManager {
	private client = {
		id: googleKey.clientId,
		secret: googleKey.secret,
		redirectUri: `${frontUrl}/auth/social?type=google`,
	};

	private config = {
		access_type: 'offline',
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		],
		include_granted_scopes: true,
	};
	private oAuth2Client: ReturnType<typeof this.setOAuth2Client>;

	constructor(
		init?: Partial<{
			client: { id: string; secret: string; redirectUri: string };
			config: {
				access_type: 'online' | 'offline';
				scope: Array<string>;
				include_granted_scopes: boolean;
			};
		}>,
	) {
		this.client = { ...this.client, ...init?.client };
		this.config = { ...this.config, ...init?.config };
		this.oAuth2Client = new google.auth.OAuth2(
			this.client.id,
			this.client.secret,
			this.client.redirectUri,
		);
	}

	private setOAuth2Client() {
		return new google.auth.OAuth2(
			this.client.id,
			this.client.secret,
			this.client.redirectUri,
		);
	}

	getRedirectUrl(state: string) {
		const url = this.oAuth2Client.generateAuthUrl({ ...this.config, state });

		return url;
	}

	async getToken(code: string) {
		try {
			const { tokens } = await this.oAuth2Client.getToken(code);

			return tokens;
		} catch (error) {
			const customError = convertErrorToCustomError(error, { trace: 'GoogleManager' });
			throw customError;
		}
	}

	async getUserInfo(token: Awaited<ReturnType<GoogleManager['getToken']>>) {
		try {
			this.oAuth2Client.setCredentials(token);

			const {
				data: { email, verified_email: verfiedEmail },
			} = await google.oauth2('v2').userinfo.get({
				auth: this.oAuth2Client,
			});

			if (!email || !verfiedEmail) {
				throw new CustomError('안전한 계정이 아닙니다. 다른 계정으로 이용해주세요.', {
					code: 403,
				});
			}

			return { email, nickname: email.split('@')[0] };
		} catch (error) {
			const customError = convertErrorToCustomError(error, { trace: 'GoogleManager' });
			throw customError;
		}
	}
}
