import { Op } from 'sequelize';

import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupModel from '@/model/group';
import UserModel from '@/model/user';
import { convertErrorToCustomError } from '@/util/error';

import { TColumnInfo } from '@/interface/model/cronGroupAccountBookRepository';

export const createNewColumn = async (columnInfo: Omit<TColumnInfo, 'id'>) => {
	try {
		const newColumn = await CronGroupAccountBookModel.create(columnInfo);

		return newColumn.id;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};

export const findGAB = async (gabInfo: Partial<TColumnInfo>, userEmail?: string) => {
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
		const gab = await CronGroupAccountBookModel.findAll({
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

export const findAllFixedColumn = async (info: {
	accountBookId: number;
	startDate?: Date;
	endDate?: Date;
}) => {
	try {
		const { accountBookId, endDate, startDate } = info;
		let dateCondition = {};
		if (endDate && startDate) {
			dateCondition = {
				where: {
					needToUpdateDate: { [Op.between]: [startDate, endDate] },
				},
			};
		}

		const columnList = await GroupModel.findAll({
			where: { accountBookId },
			include: [
				{
					model: CronGroupAccountBookModel,
					as: 'crongroupaccountbooks',
					required: true,
					...dateCondition,
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

export const updateColumn = async (
	column: CronGroupAccountBookModel,
	columnInfo: Partial<Omit<TColumnInfo, 'groupId' | 'needToUpdateDate' | 'id'>>,
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
