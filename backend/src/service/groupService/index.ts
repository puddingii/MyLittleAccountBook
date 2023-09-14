/** Library */

/** Repository */
import { findGroupList } from '@/repository/groupRepository';

/** Sub Service */

/** Interface */

/** Etc */
import { convertErrorToCustomError } from '@/util/error';

export const getGroupList = async (info: { accountBookId: number }) => {
	try {
		const groupList = await findGroupList(info);

		return groupList.map((group, index) => ({
			index,
			email: group.userEmail,
			type: group.userType,
			nickname: group.users?.nickname ?? '',
		}));
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
