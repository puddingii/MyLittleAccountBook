import GroupAccountBookModel from '@/model/groupAccountBook';
import { convertErrorToCustomError } from '@/util/error';

export const createNewColumn = async (columnInfo: {
	categoryId: number;
	spendingAndIncomeDate: Date;
	value: number;
	content?: string;
	groupId: number;
	type: 'income' | 'spending';
}) => {
	try {
		await GroupAccountBookModel.create(columnInfo);
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};
