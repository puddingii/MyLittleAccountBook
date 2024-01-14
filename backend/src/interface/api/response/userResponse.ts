import { TResponseType } from '@/interface/api/response';

export type TGet = TResponseType<{
	nickname: string;
	email: string;
	socialType: string;
	isAuthenticated: boolean;
	isGroupInvitationOn: boolean;
	isPublicUser: boolean;
}>;
export type TPatch = TResponseType<{
	accessToken: string;
	refreshToken: string;
}>;
