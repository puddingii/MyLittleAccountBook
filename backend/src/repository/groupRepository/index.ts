import { Op } from 'sequelize';

import {
	TCreateGroup,
	TCreateGroupList,
	TDeleteGroup,
	TFindAllColumn,
	TFindGroup,
	TFindGroupList,
	TUpdateGroup,
} from '@/interface/repository/groupRepository';

export const findGroup =
	(dependencies: TFindGroup['dependency']) =>
	async (groupParams: TFindGroup['param']) => {
		const {
			GroupModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const groupInfo = await GroupModel.findOne({ where: groupParams });

			return groupInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

export const findGroupList =
	(dependencies: TFindGroupList['dependency']) =>
	async (info: TFindGroupList['param']) => {
		const {
			GroupModel,
			UserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const groupList = await GroupModel.findAll({
				where: info,
				include: {
					model: UserModel,
					as: 'users',
					required: true,
				},
			});

			return groupList;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

export const createGroupList =
	(dependencies: TCreateGroupList['dependency']) =>
	async (
		groupInfoList: TCreateGroupList['param'][0],
		transaction?: TCreateGroupList['param'][1],
	) => {
		const {
			GroupModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const groupList = await GroupModel.bulkCreate(groupInfoList, {
				validate: true,
				transaction,
			});

			return groupList;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

export const createGroup =
	(dependencies: TCreateGroup['dependency']) =>
	async (groupInfo: TCreateGroup['param'][0], transaction?: TCreateGroup['param'][1]) => {
		const {
			GroupModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const group = await GroupModel.create(groupInfo, { transaction });

			return group;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

export const updateGroup =
	(dependencies: TUpdateGroup['dependency']) =>
	async (groupInfo: TUpdateGroup['param'][0], transaction?: TUpdateGroup['param'][1]) => {
		const {
			GroupModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { userEmail, accountBookId, ...updatedInfo } = groupInfo;
			const group = await GroupModel.update(updatedInfo, {
				where: { userEmail, accountBookId },
				transaction,
			});

			return group[0];
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

export const deleteGroup =
	(dependencies: TDeleteGroup['dependency']) =>
	async (info: TDeleteGroup['param'][0], transaction?: TDeleteGroup['param'][1]) => {
		const {
			GroupModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const deleteCount = await GroupModel.destroy({ where: info, transaction });

			return deleteCount;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

const getCondition = (type: string, date: Date[]) => {
	return { where: { [type]: { [Op.between]: date } } };
};

export const findAllColumn =
	(dependencies: TFindAllColumn['dependency']) =>
	async (info: TFindAllColumn['param']) => {
		const {
			GroupAccountBookModel,
			CronGroupAccountBookModel,
			GroupModel,
			UserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { accountBookId, endDate, startDate } = info;
			const isValidatedDate = endDate && startDate;

			const columnList = await GroupModel.findAll({
				where: { accountBookId },
				include: [
					{
						model: GroupAccountBookModel,
						as: 'groupaccountbooks',
						required: true,
						...(isValidatedDate
							? getCondition('spendingAndIncomeDate', [startDate, endDate])
							: {}),
					},
					{
						model: CronGroupAccountBookModel,
						as: 'crongroupaccountbooks',
						required: true,
						...(isValidatedDate
							? getCondition('needToUpdateDate', [startDate, endDate])
							: {}),
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
