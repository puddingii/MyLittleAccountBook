import { Op } from 'sequelize';

import {
	TCreateNewColumn,
	TDeleteColumn,
	TFindAllFixedColumnBasedCron,
	TFindAllFixedColumnBasedGroup,
	TFindGAB,
	TUpdateColumn,
} from '@/interface/repository/cronGroupAccountBookRepository';

export const createNewColumn =
	(dependencies: TCreateNewColumn['dependency']) =>
	async (columnInfo: TCreateNewColumn['param']) => {
		const {
			CronGroupAccountBookModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const newColumn = await CronGroupAccountBookModel.create(columnInfo);

			return newColumn;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};

export const findGAB =
	(dependencies: TFindGAB['dependency']) =>
	async (
		gabInfo: TFindGAB['param'][0],
		options?: TFindGAB['param'][1],
	): Promise<InstanceType<typeof CronGroupAccountBookModel> | undefined> => {
		const {
			CronGroupAccountBookModel,
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

export const findAllFixedColumnBasedGroup =
	(dependencies: TFindAllFixedColumnBasedGroup['dependency']) =>
	async (info: TFindAllFixedColumnBasedGroup['param']) => {
		const {
			CronGroupAccountBookModel,
			GroupModel,
			UserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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

export const findAllFixedColumnBasedCron =
	(dependencies: TFindAllFixedColumnBasedCron['dependency']) =>
	async (info: TFindAllFixedColumnBasedCron['param']) => {
		const {
			CronGroupAccountBookModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { endDate, startDate, ...condition } = info;
			let dateCondition = {};
			if (endDate && startDate) {
				dateCondition = {
					needToUpdateDate: { [Op.between]: [startDate, endDate] },
				};
			}

			const columnList = await CronGroupAccountBookModel.findAll({
				where: { ...condition, ...dateCondition },
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
