import { TResponseType } from '@/interface/api/response';

export type TCategoryMap = {
	id: number;
	parentId: number | undefined;
	name: string;
	childList: Array<Omit<TCategoryMap, 'childList'>>;
};
export type TGet = TResponseType<Array<TCategoryMap>>;
export type TPost = TResponseType<{
	id: number;
	childList?: Array<{ id: number; parentId: number; name: string }>;
}>;
