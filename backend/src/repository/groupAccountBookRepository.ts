import { Op } from 'sequelize';

import GroupModel from '@/model/group';
import GroupAccountBookModel from '@/model/groupAccountBook';
import { convertErrorToCustomError } from '@/util/error';

export const findGAB = async (
	gabInfo: Partial<{
		id: number;
		categoryId: number;
		groupId: number;
		type: 'income' | 'spending';
		content: string;
		spendingAndIncomeDate: Date;
		value: number;
	}>,
	userEmail?: string,
) => {
	try {
		const includeOption = userEmail
			? {
					include: {
						model: GroupModel,
						as: 'groups',
						required: true,
						where: {
							userEmail: { [Op.eq]: userEmail },
						},
					},
			  }
			: {};
		const gab = await GroupAccountBookModel.findAll({
			where: gabInfo,
			...includeOption,
			limit: 1,
			subQuery: false,
		});

		return gab[0];
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};

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

export const updateColumn = async (
	column: GroupAccountBookModel,
	columnInfo: {
		categoryId?: number;
		spendingAndIncomeDate?: Date;
		value?: number;
		content?: string;
		type?: 'income' | 'spending';
	},
) => {
	try {
		await column.update(columnInfo);
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};
