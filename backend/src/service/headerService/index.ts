/** Library */

/** Repository */
import { createAccountBook } from '@/repository/accountBookRepository';
import { createDefaultCategory } from '@/repository/categoryRepository';
import { createGroupList } from '@/repository/groupRepository';

/** Sub Service */

/** Interface */

/** Etc */
import sequelize from '@/loader/mysql';
import { convertErrorToCustomError } from '@/util/error';
import GroupModel from '@/model/group';

export const createAccountBookAndInviteUser = async (info: {
	title: string;
	content?: string;
	invitedUserList: Array<{ email: string; type: GroupModel['userType'] }>;
	ownerEmail: string;
}) => {
	try {
		const { title, content, invitedUserList, ownerEmail } = info;

		const transaction = await sequelize.transaction({ autocommit: false });
		try {
			const newAccountBook = await createAccountBook({ title, content }, transaction);
			await createDefaultCategory(newAccountBook.id, transaction);

			const groupInfoList = invitedUserList.map(invitedUser => ({
				userType: invitedUser.type,
				accountBookId: newAccountBook.id,
				userEmail: invitedUser.email,
			}));
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
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
