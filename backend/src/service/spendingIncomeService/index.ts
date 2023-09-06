/** Library */
import dayjs from 'dayjs';

/** Repository */
import {
	createNewColumn as createNewNFColumn,
	deleteColumn as deleteNFColumn,
	findGAB as findNotFixedGAB,
	updateColumn as updateNFColumn,
} from '@/repository/groupAccountBookRepository';
import {
	createNewColumn as createNewFColumn,
	deleteColumn as deleteFColumn,
	findGAB as findFixedGAB,
	updateColumn as updateFColumn,
} from '@/repository/cronGroupAccountBookRepository';
import { findGroup } from '@/repository/groupRepository';

/** Sub Service */
import {
	getCategory,
	getFixedColumnList,
	getNotFixedColumnList,
} from '../common/getService';

/** Interface */
import { TCycleType } from '@/interface/user';
import { TGet } from '@/interface/api/response/accountBookResponse';

/** Etc */
import { convertErrorToCustomError } from '@/util/error';

export const createNewFixedColumn = async (info: {
	userEmail: string;
	accountBookId: number;
	value: number;
	type: 'income' | 'spending';
	categoryId: number;
	cycleTime: number;
	cycleType: TCycleType;
	content?: string | undefined;
	needToUpdateDate: string;
}) => {
	try {
		const { accountBookId, userEmail, needToUpdateDate, ...columnInfo } = info;

		const group = await findGroup({ accountBookId, userEmail });
		if (!group) {
			throw new Error('가계부에 등록되지 않은 사용자 입니다.');
		}
		if (group.userType === 'observer') {
			throw new Error('글쓰기 권한이 없는 사용자 입니다.');
		}

		const newId = await createNewFColumn({
			groupId: group.id,
			needToUpdateDate: dayjs(needToUpdateDate).toDate(),
			...columnInfo,
		});

		return newId;
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

		const newId = await createNewNFColumn({
			groupId: group.id,
			spendingAndIncomeDate: dayjs(spendingAndIncomeDate).toDate(),
			...columnInfo,
		});

		return newId;
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const updateFixedColumn = async (info: {
	userEmail: string;
	id: number;
	value?: number;
	type?: 'income' | 'spending';
	categoryId?: number;
	cycleTime?: number;
	cycleType?: TCycleType;
	content?: string | undefined;
	needToUpdateDate?: string;
}) => {
	try {
		const { id, userEmail, needToUpdateDate, ...columnInfo } = info;
		const cgab = await findFixedGAB({ id }, userEmail);
		if (!cgab) {
			throw new Error('권한이 없는 사용자이거나 삭제된 내용입니다.');
		}

		await updateFColumn(cgab, {
			needToUpdateDate: dayjs(needToUpdateDate).toDate(),
			...columnInfo,
		});
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const updateNotFixedColumn = async (info: {
	userEmail: string;
	id: number;
	value?: number;
	type?: 'income' | 'spending';
	categoryId?: number;
	content?: string | undefined;
	spendingAndIncomeDate?: string;
}) => {
	try {
		const { id, userEmail, spendingAndIncomeDate, ...columnInfo } = info;
		const gab = await findNotFixedGAB({ id }, userEmail);
		if (!gab) {
			throw new Error('권한이 없는 사용자이거나 삭제된 내용입니다.');
		}

		await updateNFColumn(gab, {
			...columnInfo,
			spendingAndIncomeDate: dayjs(spendingAndIncomeDate).toDate(),
		});
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const deleteFixedColumn = async (info: { id: number; userEmail: string }) => {
	try {
		const { id, userEmail } = info;
		const cgab = await findFixedGAB({ id }, userEmail);
		if (!cgab) {
			throw new Error('권한이 없는 사용자이거나 삭제된 내용입니다.');
		}

		await deleteFColumn(cgab);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const deleteNotFixedColumn = async (info: { id: number; userEmail: string }) => {
	try {
		const { id, userEmail } = info;
		const gab = await findNotFixedGAB({ id }, userEmail);
		if (!gab) {
			throw new Error('권한이 없는 사용자이거나 삭제된 내용입니다.');
		}

		await deleteNFColumn(gab);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

/** History 및 Category 반환(해당 페이지에서 보여줄 기본값 가져오기) */
export const getDefaultInfo = async (info: {
	accountBookId: number;
	startDate: string;
	endDate: string;
}) => {
	try {
		const { accountBookId } = info;
		const categoryList = await getCategory(accountBookId, { start: 2, end: 2 });

		const notFixedList = await getNotFixedColumnList(info, categoryList);
		const fixedList = await getFixedColumnList({ accountBookId }, categoryList);

		return { history: { notFixedList, fixedList }, categoryList } as TGet['data'];
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
