import { google } from 'googleapis';

import secret from '@/config/secret';

const {
	social: { google: googleKey },
	frontUrl,
} = secret;

const config = {
	access_type: 'offline',
	scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/userinfo.email',
	],
	include_granted_scopes: true,
};

export const getClient = () => {
	return new google.auth.OAuth2(
		googleKey.clientId,
		googleKey.secret,
		`${frontUrl}/auth/social?type=google`,
	);
};

export const getUrl = (state: string) => {
	const client = getClient();
	const url = client.generateAuthUrl({ ...config, state });
	return url;
};
