import { Op } from 'sequelize';

import {
	TCreateNewColumn,
	TDeleteColumn,
	TFindAllNotFixedColumn,
	TFindGAB,
	TUpdateColumn,
} from '@/interface/repository/groupAccountBookRepository';

export const findGAB =
	(dependencies: TFindGAB['dependency']) =>
	async (
		gabInfo: TFindGAB['param'][0],
		options?: TFindGAB['param'][1],
	): Promise<InstanceType<typeof GroupAccountBookModel> | undefined> => {
		const {
			GroupAccountBookModel,
			GroupModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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

export const findAllNotFixedColumn =
	(dependencies: TFindAllNotFixedColumn['dependency']) =>
	async (info: TFindAllNotFixedColumn['param']) => {
		const {
			GroupAccountBookModel,
			GroupModel,
			UserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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

export const createNewColumn =
	(dependencies: TCreateNewColumn['dependency']) =>
	async (columnInfo: TCreateNewColumn['param']) => {
		const {
			GroupAccountBookModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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

export const updateColumn =
	(dependencies: TUpdateColumn['dependency']) =>
	async (column: TUpdateColumn['param'][0], columnInfo: TUpdateColumn['param'][1]) => {
		const {
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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

export const deleteColumn =
	(dependencies: TDeleteColumn['dependency']) =>
	async (column: TDeleteColumn['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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
