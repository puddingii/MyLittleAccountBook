import { TResponseType } from '@/interface/api/response';

type TTokenLoginResult = {
	accessToken: string;
	refreshToken: string;
};

export type TGetSocialGoogle = TResponseType<
	TTokenLoginResult | { accountBookId: number }
>;
export type TGetSocialNaver = TResponseType<
	TTokenLoginResult | { accountBookId: number }
>;
export type TGetSocial = TResponseType<{ location: string }>;
export type TPostEmail = TResponseType<TTokenLoginResult | { accountBookId: number }>;
export type TGetToken = TResponseType<Omit<TTokenLoginResult, 'refreshToken'>>;
export type TDeleteToken = TResponseType<{}>;
export type TPostJoin = TResponseType<{}>;
export type TVerifyemail = TResponseType<{ code: number }>;
export type TResendEmail = TResponseType<{ code: number }>;
export type TValidateSuperadmin = TResponseType<{ isValid: boolean }>;
