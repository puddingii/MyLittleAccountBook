import { Op } from 'sequelize';

import {
	TCreateGroup,
	TCreateGroupList,
	TDeleteGroup,
	TFindAllColumn,
	TFindGroup,
	TFindGroupAccountBookList,
	TFindGroupUserList,
	TFindGroupWithAccountBookMedia,
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

export const findGroupWithAccountBookMedia =
	(dependencies: TFindGroupWithAccountBookMedia['dependency']) =>
	async (groupParams: TFindGroupWithAccountBookMedia['param']) => {
		const {
			AccountBookMediaModel,
			GroupModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const groupInfo = await GroupModel.findOne({
				where: groupParams,
				include: {
					as: 'accountbookmedias',
					model: AccountBookMediaModel,
					where: { accountBookId: groupParams.accountBookId },
					required: false,
				},
			});

			return groupInfo;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 500,
			});
			throw customError;
		}
	};

export const findGroupAccountBookList =
	(dependencies: TFindGroupAccountBookList['dependency']) =>
	async (info: TFindGroupAccountBookList['param']) => {
		const {
			AccountBookModel,
			GroupModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const groupList = await GroupModel.findAll({
				where: info,
				include: {
					model: AccountBookModel,
					as: 'accountbooks',
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

export const findGroupUserList =
	(dependencies: TFindGroupUserList['dependency']) =>
	async (info: TFindGroupUserList['param']) => {
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
						model: UserModel,
						as: 'users',
						required: true,
						attributes: ['nickname'],
					},
					{
						model: GroupAccountBookModel,
						as: 'groupaccountbooks',
						required: false,
						...(isValidatedDate
							? getCondition('spendingAndIncomeDate', [startDate, endDate])
							: {}),
					},
					{
						model: CronGroupAccountBookModel,
						as: 'crongroupaccountbooks',
						required: false,
						...(isValidatedDate
							? getCondition('needToUpdateDate', [startDate, endDate])
							: {}),
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
