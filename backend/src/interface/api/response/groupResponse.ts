import { TResponseType } from '@/interface/api/response';
import GroupModel from '@/model/group';

export type TGetList = TResponseType<
	Array<{ index: number; type: GroupModel['userType']; email: string; nickname: string }>
>;
export type TPost = TResponseType<{
	type: GroupModel['userType'];
	email: string;
	nickname: string;
	id: number;
}>;
