/** Library */

/** Interface */
import {
	TAddGroup,
	TDeleteGroupUser,
	TGetGroupAccountBookList,
	TGetGroupUserList,
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

export const getGroupAccountBookList =
	(dependencies: TGetGroupAccountBookList['dependency']) =>
	async (info: TGetGroupAccountBookList['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findGroupAccountBookList },
		} = dependencies;

		try {
			const groupList = await findGroupAccountBookList(info);

			return groupList
				.filter(group => !!group.accountbooks)
				.map(group => ({
					accountBookId: group.accountbooks?.id ?? -1,
					accountBookName: group.accountbooks?.title ?? '',
					accountBookContent: group.accountbooks?.content ?? '',
				}));
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const getGroupUserList =
	(dependencies: TGetGroupUserList['dependency']) =>
	async (info: TGetGroupUserList['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findGroupUserList },
		} = dependencies;

		try {
			const groupList = await findGroupUserList(info);

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
			errorUtil: { convertErrorToCustomError, CustomError },
			validationUtil: { isAdminUser },
			repository: { createGroup, findGroup, findUserInfoWithPrivacy },
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

			const invitedUser = await findUserInfoWithPrivacy({ email: groupInfo.userEmail });
			if (!invitedUser) {
				throw new Error('없는 유저입니다.');
			}

			if (!invitedUser.userprivacy) {
				throw new CustomError('DB Error(Join). 운영자에게 문의주세요.', { code: 500 });
			}

			if (!invitedUser.userprivacy.isAuthenticated) {
				throw new Error('초대하려는 유저가 이메일 인증이 되지 않았습니다.');
			}

			if (!invitedUser.userprivacy.isPublicUser) {
				throw new Error('해당 유저는 비공개 상태입니다.');
			}

			if (!invitedUser.userprivacy.isGroupInvitationOn) {
				throw new Error('해당 유저는 그룹 초대를 거부한 상태입니다.');
			}

			const group = await createGroup(groupInfo);

			return {
				email: group.userEmail,
				type: group.userType,
				id: group.id,
				nickname: invitedUser.nickname ?? '',
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
