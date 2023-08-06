import secret from '@/config/secret';

const {
	social: { naver: naverKey },
	baseUrl,
} = secret;

export const client = {
	id: naverKey.clientId,
	secret: naverKey.secret,
	redirectUri: `${baseUrl}/auth/social/naver`,
};

export const config = {
	response_type: 'code',
};

export const getUrl = function (state: string) {
	const redirectBaseUrl = 'https://nid.naver.com/oauth2.0/authorize';
	const params = new URLSearchParams({
		client_id: client.id,
		redirect_uri: client.redirectUri,
		state,
		...config,
	});

	return `${redirectBaseUrl}?${params.toString()}`;
};
