/** Library */
import { append, filter, map, pipe, toArray } from '@fxts/core';

/** Interface */
import {
	TCreateAccountBookAndInviteUser,
	TCreateNewNotice,
	TDeleteNotice,
	TGetNotice,
	TGetNoticeList,
	TUpdateNotice,
} from '@/interface/service/headerService';

import GroupModel from '@/model/group';
import NoticeModel from '@/model/notice';

const isEqualUser = (a: { email: string }, b: { email: string }) => a.email === b.email;

export const createAccountBookAndInviteUser =
	(dependencies: TCreateAccountBookAndInviteUser['dependency']) =>
	async (info: TCreateAccountBookAndInviteUser['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			sequelize,
			repository: {
				createAccountBook,
				createDefaultCategory,
				createGroupList,
				findInviteEnableUserInfoList,
			},
		} = dependencies;

		try {
			const { title, content, invitedUserList, ownerEmail } = info;

			const transaction = await sequelize.transaction({ autocommit: false });
			try {
				const newAccountBook = await createAccountBook({ title, content }, transaction);
				await createDefaultCategory(newAccountBook.id, transaction);

				const filteredEmailList = pipe(
					invitedUserList,
					filter(user => user.type !== 'owner'),
					map(user => ({ email: user.email })),
					toArray,
				);

				const enableUserList = await findInviteEnableUserInfoList(filteredEmailList);

				const groupInfoList = pipe(
					invitedUserList,
					filter(invitedUser =>
						enableUserList.find(enableUser => isEqualUser(enableUser, invitedUser)),
					),
					map(invitedUser => ({
						userType: invitedUser.type as GroupModel['userType'],
						accountBookId: newAccountBook.id,
						userEmail: invitedUser.email,
					})),
					append({
						userType: 'owner' as GroupModel['userType'],
						accountBookId: newAccountBook.id,
						userEmail: ownerEmail,
					}),
					toArray,
				);

				await createGroupList(groupInfoList, transaction);

				await transaction.commit();

				return newAccountBook.id as number;
			} catch (error) {
				await transaction.rollback();
				throw error;
			}
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

const mappingNotice = (notice: NoticeModel) => {
	return {
		id: notice.id,
		title: notice.title,
		content: notice.content,
		isUpdateContent: notice.isUpdateContent,
		createdAt: notice.createdAt,
		updatedAt: notice.updatedAt,
	};
};

export const getNotice =
	(dependencies: TGetNotice['dependency']) => async (info: TGetNotice['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findOneNotice },
		} = dependencies;

		try {
			const notice = await findOneNotice(info);
			if (!notice) {
				throw new Error('삭제된 공지입니다.');
			}

			return mappingNotice(notice);
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const getNoticeList =
	(dependencies: TGetNoticeList['dependency']) =>
	async (info: TGetNoticeList['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findNoticeList },
		} = dependencies;

		try {
			const result = await findNoticeList(info);

			return { count: result.count, list: result.rows.map(mappingNotice) };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const updateNotice =
	(dependencies: TUpdateNotice['dependency']) => async (info: TUpdateNotice['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { updateNotice },
			dateUtil: { getCurrentDate },
		} = dependencies;

		try {
			const updatedCount = await updateNotice({
				...info,
				updatedAt: getCurrentDate(),
			});

			return { count: updatedCount };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const deleteNotice =
	(dependencies: TDeleteNotice['dependency']) => async (info: TDeleteNotice['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { deleteNotice },
		} = dependencies;

		try {
			const deletedCount = await deleteNotice(info);

			return { count: deletedCount };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const createNewNotice =
	(dependencies: TCreateNewNotice['dependency']) =>
	async (info: TCreateNewNotice['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { createNotice },
		} = dependencies;

		try {
			const { id, content, createdAt, isUpdateContent, title } = await createNotice(info);

			return { id, content, isUpdateContent, createdAt, title };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
