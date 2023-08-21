/** Library */
import dayjs from 'dayjs';

/** Repository */
import { createNewColumn as createNewNFColumn } from '@/repository/groupAccountBookRepository';
import { createNewColumn as createNewFColumn } from '@/repository/cronGroupAccountBookRepository';
import { findGroup } from '@/repository/groupRepository';

/** Interface */
import { TCycleType } from '@/interface/user';

/** Etc */
import { convertErrorToCustomError } from '@/util/error';
import { calculateNextCycle } from '@/util/date';

export const createNewFixedColumn = async (info: {
	userEmail: string;
	accountBookId: number;
	value: number;
	type: 'income' | 'spending';
	categoryId: number;
	cycleTime: number;
	cycleType: TCycleType;
	content?: string | undefined;
}) => {
	try {
		const { accountBookId, userEmail, ...columnInfo } = info;

		const group = await findGroup({ accountBookId, userEmail });
		if (!group) {
			throw new Error('가계부에 등록되지 않은 사용자 입니다.');
		}
		if (group.userType === 'observer') {
			throw new Error('글쓰기 권한이 없는 사용자 입니다.');
		}

		const needToUpdateDate = calculateNextCycle(
			new Date(),
			columnInfo.cycleTime,
			columnInfo.cycleType,
		);
		await createNewFColumn({
			groupId: group.id,
			needToUpdateDate,
			...columnInfo,
		});
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const createNewNotFixedColumn = async (info: {
	userEmail: string;
	accountBookId: number;
	value: number;
	type: 'income' | 'spending';
	categoryId: number;
	content?: string | undefined;
	spendingAndIncomeDate: string;
}) => {
	try {
		const { accountBookId, userEmail, spendingAndIncomeDate, ...columnInfo } = info;

		const group = await findGroup({ accountBookId, userEmail });
		if (!group) {
			throw new Error('가계부에 등록되지 않은 사용자 입니다.');
		}
		if (group.userType === 'observer') {
			throw new Error('글쓰기 권한이 없는 사용자 입니다.');
		}

		await createNewNFColumn({
			groupId: group.id,
			spendingAndIncomeDate: dayjs(spendingAndIncomeDate).toDate(),
			...columnInfo,
		});
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
