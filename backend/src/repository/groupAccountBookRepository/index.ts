import { Op } from 'sequelize';

import GroupModel from '@/model/group';
import GroupAccountBookModel from '@/model/groupAccountBook';
import UserModel from '@/model/user';
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
	options?: { isIncludeGroup: boolean },
) => {
	try {
		const includeOption = options?.isIncludeGroup
			? {
					include: {
						model: GroupModel,
						as: 'groups',
						required: true,
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
			code: 400,
		});
		throw customError;
	}
};

export const findAllNotFixedColumn = async (info: {
	accountBookId: number;
	startDate: Date;
	endDate: Date;
}) => {
	try {
		const { accountBookId, endDate, startDate } = info;
		const columnList = await GroupModel.findAll({
			where: { accountBookId },
			include: [
				{
					model: GroupAccountBookModel,
					as: 'groupaccountbooks',
					required: true,
					where: {
						spendingAndIncomeDate: { [Op.between]: [startDate, endDate] },
					},
				},
				{
					model: UserModel,
					as: 'users',
					required: true,
					attributes: ['nickname'],
				},
			],
			subQuery: false,
		});

		return columnList;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
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
		const newColumn = await GroupAccountBookModel.create(columnInfo);

		return newColumn.id;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
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
			code: 400,
		});
		throw customError;
	}
};

export const deleteColumn = async (column: GroupAccountBookModel) => {
	try {
		await column.destroy();
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
		});
		throw customError;
	}
};
