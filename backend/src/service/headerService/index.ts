/** Library */
import { append, filter, map, pipe, toArray } from '@fxts/core';

/** Interface */
import {
	TCreateAccountBookAndInviteUser,
	TGetNotice,
	TGetNoticeList,
} from '@/interface/service/headerService';
import GroupModel from '@/model/group';

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

			return notice;
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

			return { count: result.count, list: result.rows };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
