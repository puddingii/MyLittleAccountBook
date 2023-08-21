import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import { convertErrorToCustomError } from '@/util/error';

import { TCycleType } from '@/interface/user';

export const createNewColumn = async (columnInfo: {
	categoryId: number;
	value: number;
	content?: string;
	groupId: number;
	cycleTime: number;
	cycleType: TCycleType;
	needToUpdateDate: Date;
	type: 'income' | 'spending';
}) => {
	try {
		await CronGroupAccountBookModel.create(columnInfo);
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};
