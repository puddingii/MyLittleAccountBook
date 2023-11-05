/** Library */
import dayjs from 'dayjs';

/** Interface */
import { TGet } from '@/interface/api/response/accountBookResponse';
import {
	TCreateNewFixedColumn,
	TCreateNewNotFixedColumn,
	TDeleteFixedColumn,
	TDeleteNotFixedColumn,
	TGetDefaultInfo,
	TUpdateFixedColumn,
	TUpdateNotFixedColumn,
} from '@/interface/service/spendingIncomeService';

export const createNewFixedColumn =
	(dependencies: TCreateNewFixedColumn['dependency']) =>
	async (info: TCreateNewFixedColumn['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { createNewFColumn, findGroup },
		} = dependencies;

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
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const createNewNotFixedColumn =
	(dependencies: TCreateNewNotFixedColumn['dependency']) =>
	async (info: TCreateNewNotFixedColumn['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { createNewNFColumn, findGroup },
		} = dependencies;

		try {
			const { accountBookId, userEmail, spendingAndIncomeDate, ...columnInfo } = info;

			const group = await findGroup({ accountBookId, userEmail });
			if (!group) {
				throw new Error('가계부에 등록되지 않은 사용자 입니다.');
			}
			if (group.userType === 'observer') {
				throw new Error('글쓰기 권한이 없는 사용자 입니다.');
			}

			const newColumn = await createNewNFColumn({
				groupId: group.id,
				spendingAndIncomeDate: dayjs(spendingAndIncomeDate).toDate(),
				...columnInfo,
			});

			return newColumn.id;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const updateFixedColumn =
	(dependencies: TUpdateFixedColumn['dependency']) =>
	async (info: TUpdateFixedColumn['param']) => {
		const {
			errorUtil: { convertErrorToCustomError, CustomError },
			service: { checkAdminGroupUser },
			repository: { findFixedGAB, updateFColumn },
		} = dependencies;

		try {
			const { id, userEmail, needToUpdateDate, ...columnInfo } = info;
			const cgab = await findFixedGAB({ id }, { isIncludeGroup: true });
			if (!cgab) {
				throw new Error('삭제된 내용입니다.');
			}

			if (!cgab.groups) {
				throw new CustomError('DB 에러. 운영자에게 문의 주세요.', { code: 500 });
			}

			if (cgab.groups.userEmail !== userEmail) {
				await checkAdminGroupUser({
					userEmail,
					accountBookId: cgab.groups.accountBookId,
				});
			}

			await updateFColumn(cgab, {
				needToUpdateDate: dayjs(needToUpdateDate).toDate(),
				...columnInfo,
			});
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const updateNotFixedColumn =
	(dependencies: TUpdateNotFixedColumn['dependency']) =>
	async (info: TUpdateNotFixedColumn['param']) => {
		const {
			errorUtil: { convertErrorToCustomError, CustomError },
			service: { checkAdminGroupUser },
			repository: { findNotFixedGAB, updateNFColumn },
		} = dependencies;

		try {
			const { id, userEmail, spendingAndIncomeDate, ...columnInfo } = info;
			const gab = await findNotFixedGAB({ id }, { isIncludeGroup: true });
			if (!gab) {
				throw new Error('삭제된 내용입니다.');
			}

			if (!gab.groups) {
				throw new CustomError('DB 에러. 운영자에게 문의 주세요.', { code: 500 });
			}

			if (gab.groups.userEmail !== userEmail) {
				await checkAdminGroupUser({ userEmail, accountBookId: gab.groups.accountBookId });
			}

			await updateNFColumn(gab, {
				...columnInfo,
				spendingAndIncomeDate: dayjs(spendingAndIncomeDate).toDate(),
			});
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const deleteFixedColumn =
	(dependencies: TDeleteFixedColumn['dependency']) =>
	async (info: TDeleteFixedColumn['param']) => {
		const {
			errorUtil: { convertErrorToCustomError, CustomError },
			service: { checkAdminGroupUser },
			repository: { findFixedGAB, deleteFColumn },
		} = dependencies;

		try {
			const { id, userEmail } = info;
			const cgab = await findFixedGAB({ id }, { isIncludeGroup: true });
			if (!cgab) {
				throw new Error('삭제된 내용입니다.');
			}

			if (!cgab.groups) {
				throw new CustomError('DB 에러. 운영자에게 문의 주세요.', { code: 500 });
			}

			if (cgab.groups.userEmail !== userEmail) {
				await checkAdminGroupUser({
					userEmail,
					accountBookId: cgab.groups.accountBookId,
				});
			}

			await deleteFColumn(cgab);
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const deleteNotFixedColumn =
	(dependencies: TDeleteNotFixedColumn['dependency']) =>
	async (info: TDeleteNotFixedColumn['param']) => {
		const {
			errorUtil: { convertErrorToCustomError, CustomError },
			service: { checkAdminGroupUser },
			repository: { findNotFixedGAB, deleteNFColumn },
		} = dependencies;

		try {
			const { id, userEmail } = info;
			const gab = await findNotFixedGAB({ id }, { isIncludeGroup: true });
			if (!gab) {
				throw new Error('삭제된 내용입니다.');
			}

			if (!gab.groups) {
				throw new CustomError('DB 에러. 운영자에게 문의 주세요.', { code: 500 });
			}

			if (gab.groups.userEmail !== userEmail) {
				await checkAdminGroupUser({ userEmail, accountBookId: gab.groups.accountBookId });
			}

			await deleteNFColumn(gab);
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

/** History 및 Category 반환(해당 페이지에서 보여줄 기본값 가져오기) */
export const getDefaultInfo =
	(dependencies: TGetDefaultInfo['dependency']) =>
	async (info: TGetDefaultInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			service: { getCategory, getFixedColumnList, getNotFixedColumnList },
		} = dependencies;

		try {
			const { accountBookId } = info;
			const categoryList = await getCategory(accountBookId, { start: 2, end: 2 });

			const notFixedList = await getNotFixedColumnList(info, categoryList);
			const fixedList = await getFixedColumnList({ accountBookId }, categoryList);

			return { history: { notFixedList, fixedList }, categoryList } as TGet['data'];
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
