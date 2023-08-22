import GroupModel from '@/model/group';
import { convertErrorToCustomError } from '@/util/error';

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
		});
		throw customError;
	}
};
