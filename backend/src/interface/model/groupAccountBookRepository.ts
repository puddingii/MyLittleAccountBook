import { TColumnType } from '../user';

export type TColumnInfo = {
	id: number;
	categoryId: number;
	value: number;
	content?: string;
	groupId: number;
	spendingAndIncomeDate: Date;
	type: TColumnType;
};
