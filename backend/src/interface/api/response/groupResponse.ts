import { TResponseType } from '@/interface/api/response';
import GroupModel from '@/model/group';

export type TGetList = TResponseType<
	Array<{ index: number; type: GroupModel['userType']; email: string; nickname: string }>
>;

export type TGetAccountBookList = TResponseType<
	Array<{
		accountBookId: number;
		accountBookName: string;
		accountBookContent: string;
	}>
>;

export type TPost = TResponseType<{
	type: GroupModel['userType'];
	email: string;
	nickname: string;
	id: number;
}>;
export type TGetValidate = TResponseType<{ isValid: boolean }>;

export type TPatch = TResponseType<{}>;

export type TDelete = TResponseType<{}>;
