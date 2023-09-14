import { Transaction } from 'sequelize';

import GroupModel from '@/model/group';
import { convertErrorToCustomError } from '@/util/error';
import UserModel from '@/model/user';

export const findGroup = async (
	groupParams: Partial<{
		userEmail: string;
		accountBookId: number;
		id: number;
		userType: string;
		accessHistory: Date;
	}>,
) => {
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

export const findGroupList = async (info: { accountBookId: number }) => {
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

export const createGroupList = async (
	groupInfoList: Array<{
		userEmail: string;
		userType: GroupModel['userType'];
		accessHistory?: Date;
		accountBookId: number;
	}>,
	transaction?: Transaction,
) => {
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

export const updateGroup = async (
	groupInfo: {
		userEmail: string;
		userType?: GroupModel['userType'];
		accessHistory?: Date;
		accountBookId: number;
	},
	transaction?: Transaction,
) => {
	try {
		const { userEmail, accountBookId, ...updateInfo } = groupInfo;
		const groupList = await GroupModel.update(
			{ userEmail, accountBookId },
			{
				where: updateInfo,
				transaction,
			},
		);

		return groupList;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
		});
		throw customError;
	}
};
