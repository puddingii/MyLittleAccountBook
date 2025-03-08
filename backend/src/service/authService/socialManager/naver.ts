/** Interfaces */
import { TNaverSocialInfo, ISocialManager } from '@/interface/auth';

/** ETC.. */
import secret from '@/config/secret';
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

const {
	social: { naver: naverKey },
	frontUrl,
} = secret;

export default class NaverManager implements ISocialManager {
	private client = {
		id: naverKey.clientId,
		secret: naverKey.secret,
		redirectUri: `${frontUrl}/auth/social?type=naver`,
	};

	private config = {
		response_type: 'code',
	};

	constructor(
		init?: Partial<{
			client: { id: string; secret: string; redirectUri: string };
			config: { response_type: string };
		}>,
	) {
		this.client = { ...this.client, ...init?.client };
		this.config = { ...this.config, ...init?.config };
	}

	private isSuccessToken(
		token: TNaverSocialInfo['TokenInfo'],
	): token is TNaverSocialInfo['FailTokenResponse'] {
		return Boolean(!token || (token as TNaverSocialInfo['FailTokenResponse']).error);
	}

	getRedirectUrl(state: string) {
		const redirectBaseUrl = 'https://nid.naver.com/oauth2.0/authorize';
		const params = new URLSearchParams({
			...this.config,
			client_id: this.client.id,
			redirect_uri: this.client.redirectUri,
			state,
		});

		return `${redirectBaseUrl}?${params.toString()}`;
	}

	async getToken(code: string, state: string) {
		try {
			const tokenBaseUrl = 'https://nid.naver.com/oauth2.0/token';
			const paramStr = new URLSearchParams({
				grant_type: 'authorization_code',
				client_id: this.client.id,
				client_secret: this.client.secret,
				redirect_uri: this.client.redirectUri,
				code,
				state,
			});
			const headers = new Headers({
				'X-Naver-Client-Id': this.client.id,
				'X-Naver-Client-Secret': this.client.secret,
			});
			const response = await fetch(`${tokenBaseUrl}?${paramStr}`, {
				headers,
				method: 'GET',
			});

			const tokenInfo = (await response.json()) as TNaverSocialInfo['TokenInfo'];
			if (this.isSuccessToken(tokenInfo)) {
				throw new CustomError(
					`(${tokenInfo.error}) ${response.statusText || tokenInfo.error_description}`,
					{ code: response.status },
				);
			}

			return tokenInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, { trace: 'NaverManager' });
			throw customError;
		}
	}

	async getUserInfo(token: Awaited<ReturnType<NaverManager['getToken']>>) {
		try {
			const tokenBaseUrl = 'https://openapi.naver.com/v1/nid/me';

			const headers = new Headers({
				Authorization: `Bearer ${token.access_token}`,
			});
			const response = await fetch(tokenBaseUrl, {
				headers,
				method: 'GET',
			});

			if (!response.ok) {
				throw new CustomError(response.statusText, { code: response.status });
			}
			const decodedData = (await response.json()) as {
				resultcode: string;
				message: string;
				response: unknown;
			};

			if (decodedData.resultcode !== '00') {
				throw new CustomError(`code[${decodedData.resultcode}]: ${decodedData.message}`, {
					code: 500,
				});
			}
			const userInfo = decodedData.response as TNaverSocialInfo['UserInfo'];

			return userInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, { trace: 'NaverManager' });
			throw customError;
		}
	}
}
