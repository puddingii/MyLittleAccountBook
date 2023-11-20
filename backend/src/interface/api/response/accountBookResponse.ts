import { TResponseType } from '@/interface/api/response';
import { TCycleType } from '@/interface/user';
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupAccountBookModel from '@/model/groupAccountBook';

export type TPostColumn = TResponseType<{ newId: number }>;
export type TPatchColumn = TResponseType<{}>;
export type TDeleteColumn = TResponseType<{}>;

type TNotFixedList = Array<{
	id: number;
	gabId: number;
	nickname: string;
	category: string;
	type: GroupAccountBookModel['type'];
	spendingAndIncomeDate: Date;
	value: number;
	content?: string;
}>;
type TFixedList = Array<{
	id: number;
	gabId: number;
	nickname: string;
	category: string;
	type: CronGroupAccountBookModel['type'];
	cycleType: TCycleType;
	cycleTime: number;
	needToUpdateDate: Date;
	value: number;
	content?: string;
}>;
export type TGet = TResponseType<{
	history: {
		notFixedList: TNotFixedList;
		fixedList: TFixedList;
	};
	categoryList: Array<{
		parentId?: number;
		childId: number;
		parentName: string;
		categoryNamePath: string;
		categoryIdPath: string;
	}>;
}>;
export type TGetSummary = TResponseType<{
	notFixedIncomeList: Array<TNotFixedList>;
	notFixedSpendingList: Array<TNotFixedList>;
	fixedIncomeList: TFixedList;
	fixedSpendingList: TFixedList;
}>;
