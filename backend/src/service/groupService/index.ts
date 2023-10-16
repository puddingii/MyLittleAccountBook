/** Library */

/** Interface */
import {
	TAddGroup,
	TDeleteGroupUser,
	TGetGroupList,
	TUpdateGroupInfo,
	TValidateGroupUser,
} from '@/interface/service/groupService';

export const validateGroupUser =
	(dependencies: TValidateGroupUser['dependency']) =>
	async (info: TValidateGroupUser['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findGroup },
		} = dependencies;

		try {
			const myGroupInfo = await findGroup({
				userEmail: info.myEmail,
				accountBookId: info.accountBookId,
			});

			return { isValid: !!myGroupInfo };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const getGroupList =
	(dependencies: TGetGroupList['dependency']) => async (info: TGetGroupList['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findGroupList },
		} = dependencies;

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
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const addGroup =
	(dependencies: TAddGroup['dependency']) => async (info: TAddGroup['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			validationUtil: { isAdminUser },
			repository: { createGroup, findGroup, findUserInfo },
		} = dependencies;

		try {
			const { myEmail, ...groupInfo } = info;
			const myGroupInfo = await findGroup({
				userEmail: myEmail,
				accountBookId: info.accountBookId,
			});
			if (!myGroupInfo) {
				throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
			}
			if (!isAdminUser(myGroupInfo.userType)) {
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
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const updateGroupInfo =
	(dependencies: TUpdateGroupInfo['dependency']) =>
	async (info: TUpdateGroupInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError, CustomError },
			validationUtil: { isAdminUser },
			repository: { findGroup, updateGroup },
		} = dependencies;

		try {
			const { myEmail, ...groupInfo } = info;
			const myGroupInfo = await findGroup({
				userEmail: myEmail,
				accountBookId: info.accountBookId,
			});
			if (!myGroupInfo) {
				throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
			}
			if (!isAdminUser(myGroupInfo.userType)) {
				throw new Error('관리 가능한 유저가 아닙니다.');
			}

			const successCount = await updateGroup(groupInfo);
			if (successCount === 0) {
				throw new CustomError('성공적으로 저장되지 않았습니다.', { code: 500 });
			}
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const deleteGroupUser =
	(dependencies: TDeleteGroupUser['dependency']) =>
	async (info: TDeleteGroupUser['param']) => {
		const {
			errorUtil: { convertErrorToCustomError, CustomError },
			validationUtil: { isAdminUser },
			repository: { findGroup, deleteGroup },
		} = dependencies;

		try {
			const { myEmail, accountBookId, id } = info;
			const myGroupInfo = await findGroup({
				userEmail: myEmail,
				accountBookId,
			});
			if (!myGroupInfo) {
				throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
			}
			if (!isAdminUser(myGroupInfo.userType)) {
				throw new Error('관리 가능한 유저가 아닙니다.');
			}

			const deleteCount = await deleteGroup({ accountBookId, id });
			if (deleteCount === 0) {
				throw new CustomError('성공적으로 삭제되지 않았습니다.', { code: 500 });
			}
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
