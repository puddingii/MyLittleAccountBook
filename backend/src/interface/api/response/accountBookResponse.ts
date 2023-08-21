import { TResponseType } from '@/interface/api/response';

export type TGetCategory = TResponseType<
	Array<{
		parentId: number;
		childId: number;
		parentName: string;
		categoryNamePath: string;
		categoryIdPath: string;
	}>
>;

export type TPostColumn = TResponseType<{}>;
