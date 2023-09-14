/** Library */

/** Repository */
import GroupModel from '@/model/group';
import { createGroup, findGroup, findGroupList } from '@/repository/groupRepository';
import { findUserInfo } from '@/repository/userRepository';

/** Sub Service */

/** Interface */

/** Etc */
import { convertErrorToCustomError } from '@/util/error';

const isAdmin = (userType: GroupModel['userType']) => {
	const adminList = ['owner', 'manager'];

	return adminList.findIndex(adminType => adminType === userType) !== -1;
};

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
