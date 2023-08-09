import { TResponseType } from '@/interface/api';

type TTokenLoginResult = {
	accessToken: string;
	refreshToken: string;
};

export type TGetSocialGoogle = TResponseType<TTokenLoginResult>;
export type TGetSocialNaver = TResponseType<TTokenLoginResult>;
export type TPostEmail = TResponseType<TTokenLoginResult>;
export type TGetRefresh = TResponseType<Omit<TTokenLoginResult, 'refreshToken'>>;
export type TPostJoin = TResponseType<{}>;
