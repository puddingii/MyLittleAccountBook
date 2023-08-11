import { TResponseType } from '@/interface/api';

type TTokenLoginResult = {
	accessToken: string;
	refreshToken: string;
};

export type TGetSocialGoogle = TResponseType<TTokenLoginResult>;
export type TGetSocialNaver = TResponseType<TTokenLoginResult>;
export type TGetSocial = TResponseType<{ location: string }>;
export type TPostEmail = TResponseType<TTokenLoginResult>;
export type TGetToken = TResponseType<Omit<TTokenLoginResult, 'refreshToken'>>;
export type TDeleteToken = TResponseType<{}>;
export type TPostJoin = TResponseType<{}>;
