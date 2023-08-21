import GroupModel from '@/model/group';
import { convertErrorToCustomError } from '@/util/error';

export const findGroup = async (groupParams: {
	userEmail: string;
	accountBookId: number;
}) => {
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
