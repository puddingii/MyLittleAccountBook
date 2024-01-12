/** Library */

/** Interface */
import {
	TCreateAccountBookAndInviteUser,
	TGetNotice,
	TGetNoticeList,
} from '@/interface/service/headerService';
import GroupModel from '@/model/group';

export const createAccountBookAndInviteUser =
	(dependencies: TCreateAccountBookAndInviteUser['dependency']) =>
	async (info: TCreateAccountBookAndInviteUser['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			sequelize,
			repository: { createAccountBook, createDefaultCategory, createGroupList },
		} = dependencies;

		try {
			const { title, content, invitedUserList, ownerEmail } = info;

			const transaction = await sequelize.transaction({ autocommit: false });
			try {
				const newAccountBook = await createAccountBook({ title, content }, transaction);
				await createDefaultCategory(newAccountBook.id, transaction);

				const groupInfoList: Array<{
					userType: GroupModel['userType'];
					accountBookId: number;
					userEmail: string;
				}> = invitedUserList.map(invitedUser => {
					if (invitedUser.type === 'owner') {
						throw new Error('초대된 유저는 Owner가 될 수 없습니다.');
					}

					return {
						userType: invitedUser.type,
						accountBookId: newAccountBook.id,
						userEmail: invitedUser.email,
					};
				});
				groupInfoList.push({
					userEmail: ownerEmail,
					accountBookId: newAccountBook.id,
					userType: 'owner',
				});

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
