import { oauth2_v2 as googleOAuth } from 'googleapis';

export type TSocialType = 'Google' | 'Naver';

export type TDecodedAccessTokenInfo = { nickname: string; email: string };

export type TGoogleSocialInfo = {
	SuccessTokenResponse: {
		/**
		 * This field is only present if the access_type parameter was set to offline in the authentication request. For details, see Refresh tokens.
		 */
		refresh_token?: string | null;
		/**
		 * The time in ms at which this token is thought to expire.
		 */
		expiry_date?: number | null;
		/**
		 * A token that can be sent to a Google API.
		 */
		access_token?: string | null;
		/**
		 * Identifies the type of token returned. At this time, this field always has the value Bearer.
		 */
		token_type?: string | null;
		/**
		 * A JWT that contains identity information about the user that is digitally signed by Google.
		 */
		id_token?: string | null;
		/**
		 * The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
		 */
		scope?: string;
	};
	UserInfo: { nickname: string; email: string };
};

export type TNaverSocialInfo = {
	SuccessTokenResponse: {
		access_token: string;
		refresh_token: string;
		token_type: 'Bearer' | 'MAC';
		expires_in: string;
	};
	FailTokenResponse: {
		error: string;
		error_description: string;
	};
	TokenInfo:
		| TNaverSocialInfo['SuccessTokenResponse']
		| TNaverSocialInfo['FailTokenResponse'];
	UserInfo: { id: string; nickname: string; email: string };
};
export type TSocialUserInfo =
	| TGoogleSocialInfo['UserInfo']
	| TNaverSocialInfo['UserInfo'];

export type TSocialTokenInfo =
	| TNaverSocialInfo['SuccessTokenResponse']
	| TGoogleSocialInfo['SuccessTokenResponse'];

export interface ISocialManager {
	getRedirectUrl(state: string): string;
	getUserInfo(
		token: Awaited<ReturnType<ISocialManager['getToken']>>,
	): Promise<TSocialUserInfo>;
	getToken(code: string, state?: string): Promise<TSocialTokenInfo>;
}
