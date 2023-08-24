import { TCycleType } from '../user';

export type TColumnInfo = {
	id: number;
	categoryId: number;
	value: number;
	content?: string;
	groupId: number;
	cycleTime: number;
	cycleType: TCycleType;
	needToUpdateDate: Date;
	type: 'income' | 'spending';
};
