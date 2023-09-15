/** Library */

/** Repository */
import {
	createGroup,
	deleteGroup,
	findGroup,
	findGroupList,
	isAdmin,
	updateGroup,
} from '@/repository/groupRepository';
import { findUserInfo } from '@/repository/userRepository';

/** Sub Service */

/** Interface */

/** Etc */
import GroupModel from '@/model/group';
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

export const getGroupList = async (info: { accountBookId: number }) => {
	try {
		const groupList = await findGroupList(info);

		return groupList.map((group, index) => ({
			index,
			id: group.id,
			email: group.userEmail,
			type: group.userType,
			nickname: group.users?.nickname ?? '',
		}));
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const addGroup = async (info: {
	myEmail: string;
	userEmail: string;
	userType: GroupModel['userType'];
	accessHistory?: Date;
	accountBookId: number;
}) => {
	try {
		const { myEmail, ...groupInfo } = info;
		const myGroupInfo = await findGroup({
			userEmail: myEmail,
			accountBookId: info.accountBookId,
		});
		if (!myGroupInfo) {
			throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
		}
		if (!isAdmin(myGroupInfo.userType)) {
			throw new Error('관리 가능한 유저가 아닙니다.');
		}

		const group = await createGroup(groupInfo);
		const userInfo = await findUserInfo({ email: group.userEmail });

		return {
			email: group.userEmail,
			type: group.userType,
			id: group.id,
			nickname: userInfo?.nickname ?? '',
		};
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const updateGroupInfo = async (info: {
	myEmail: string;
	userEmail: string;
	userType?: GroupModel['userType'];
	accessHistory?: Date;
	accountBookId: number;
}) => {
	try {
		const { myEmail, ...groupInfo } = info;
		const myGroupInfo = await findGroup({
			userEmail: myEmail,
			accountBookId: info.accountBookId,
		});
		if (!myGroupInfo) {
			throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
		}
		if (!isAdmin(myGroupInfo.userType)) {
			throw new Error('관리 가능한 유저가 아닙니다.');
		}

		const successCount = await updateGroup(groupInfo);
		if (successCount === 0) {
			throw new CustomError('성공적으로 저장되지 않았습니다.', { code: 500 });
		}
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const deleteGroupUser = async (info: {
	myEmail: string;
	accountBookId: number;
	id: number;
}) => {
	try {
		const { myEmail, accountBookId, id } = info;
		const myGroupInfo = await findGroup({
			userEmail: myEmail,
			accountBookId,
		});
		if (!myGroupInfo) {
			throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
		}
		if (!isAdmin(myGroupInfo.userType)) {
			throw new Error('관리 가능한 유저가 아닙니다.');
		}

		const deleteCount = await deleteGroup({ accountBookId, id });
		if (deleteCount === 0) {
			throw new CustomError('성공적으로 삭제되지 않았습니다.', { code: 500 });
		}
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
