import { TResponseType } from '@/interface/api/response';
import { TCycleType } from '@/interface/user';

export type TPostColumn = TResponseType<{ newId: number }>;
export type TDeleteColumn = TResponseType<{}>;
export type TGet = TResponseType<{
	history: {
		notFixedList: Array<{
			id: number;
			gabId: number;
			nickname: string;
			category: string;
			type: string;
			spendingAndIncomeDate: Date;
			value: number;
			content?: string;
		}>;
		fixedList: Array<{
			id: number;
			gabId: number;
			nickname: string;
			category: string;
			type: string;
			cycleType: TCycleType;
			cycleTime: number;
			needToUpdateDate: Date;
			value: number;
			content?: string;
		}>;
	};
	categoryList: Array<{
		parentId?: number;
		childId: number;
		parentName: string;
		categoryNamePath: string;
		categoryIdPath: string;
	}>;
}>;
