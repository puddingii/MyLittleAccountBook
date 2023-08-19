import { TResponseType } from '@/interface/api';
import { TCategoryInfo } from '../model/categoryRepository';

export type TGetCategory = TResponseType<
	Array<{
		parentId: number;
		childId: number;
		parentName: string;
		categoryNamePath: string;
		categoryIdPath: string;
	}>
>;
