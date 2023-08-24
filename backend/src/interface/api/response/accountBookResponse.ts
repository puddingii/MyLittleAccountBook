import { TResponseType } from '@/interface/api/response';
import { TCycleType } from '@/interface/user';

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
export type TGet = TResponseType<{
	historyList:
		| Array<{
				id: number;
				gabId: number;
				nickname: string;
				category: string;
				type: string;
				spendingAndIncomeDate: Date;
				value: number;
				content?: string;
		  }>
		| Array<{
				id: number;
				gabId: number;
				nickname: string;
				category: string;
				type: string;
				cycleType: TCycleType;
				cycleTime: number;
				value: number;
				content?: string;
		  }>;
	categoryList: Array<{
		parentId?: number;
		childId: number;
		parentName: string;
		categoryNamePath: string;
		categoryIdPath: string;
	}>;
}>;
