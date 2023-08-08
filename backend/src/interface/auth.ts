export type TSocialType = 'Google' | 'Naver';

export type TDecodedAccessTokenInfo = { nickname: string; email: string };

export interface INaverSocialInfo {
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
	TokenInfo: INaverSocialInfo['SuccessTokenResponse'] &
		INaverSocialInfo['FailTokenResponse'];
	UserInfo: { id: string; nickname: string; email: string };
}
