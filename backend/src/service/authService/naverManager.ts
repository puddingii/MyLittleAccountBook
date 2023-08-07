import fetch, { Headers } from 'node-fetch';

/** Interfaces */
import { INaverSocialInfo } from '@/interface/auth';

/** ETC.. */
import secret from '@/config/secret';
import { convertErrorToCustomError } from '@/util/error';

const {
	social: { naver: naverKey },
	baseUrl,
} = secret;

const client = {
	id: naverKey.clientId,
	secret: naverKey.secret,
	redirectUri: `${baseUrl}/auth/social/naver`,
};

const config = {
	response_type: 'code',
};

export const getUrl = (state: string) => {
	const redirectBaseUrl = 'https://nid.naver.com/oauth2.0/authorize';
	const params = new URLSearchParams({
		...config,
		client_id: client.id,
		redirect_uri: client.redirectUri,
		state,
	});

	return `${redirectBaseUrl}?${params.toString()}`;
};

export const getTokenInfo = async (code: string, state: string) => {
	try {
		const tokenBaseUrl = 'https://nid.naver.com/oauth2.0/token';
		const paramStr = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: client.id,
			client_secret: client.secret,
			redirect_uri: client.redirectUri,
			code,
			state,
		});
		const headers = new Headers({
			'X-Naver-Client-Id': client.id,
			'X-Naver-Client-Secret': client.secret,
		});
		const response = await fetch(`${tokenBaseUrl}?${paramStr}`, {
			headers,
			method: 'GET',
		});

		const tokenInfo = (await response.json()) as INaverSocialInfo['TokenInfo'];
		if (!response.ok || tokenInfo.error) {
			throw new Error(
				`(${response.status || tokenInfo.error}) ${
					response.statusText || tokenInfo.error_description
				}`,
			);
		}

		return tokenInfo as INaverSocialInfo['SuccessTokenResponse'];
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'NaverManager' });
		throw customError;
	}
};

export const getUserInfo = async (code: string) => {
	try {
		const tokenBaseUrl = 'https://openapi.naver.com/v1/nid/me';

		const headers = new Headers({
			Authorization: `Bearer ${code}`,
			'X-Naver-Client-Id': client.id,
			'X-Naver-Client-Secret': client.secret,
		});
		const response = await fetch(tokenBaseUrl, {
			headers,
			method: 'GET',
		});

		const userInfo = await response.json();
		if (!response.ok) {
			throw new Error(`(${response.status}) ${response.statusText}`);
		}

		return userInfo as INaverSocialInfo['UserInfo'];
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'NaverManager' });
		throw customError;
	}
};