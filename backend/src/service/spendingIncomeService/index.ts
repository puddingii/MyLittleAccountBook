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
			dateUtil: { toDate },
			repository: { createNewFColumn, findGroup },
			eventEmitter,
		} = dependencies;

		try {
			const { accountBookId, userEmail, userNickname, needToUpdateDate, ...columnInfo } =
				info;

			const group = await findGroup({ accountBookId, userEmail });
			if (!group) {
				throw new Error('가계부에 등록되지 않은 사용자 입니다.');
			}
			if (group.userType === 'observer') {
				throw new Error('글쓰기 권한이 없는 사용자 입니다.');
			}

			const newColumn = await createNewFColumn({
				groupId: group.id,
				needToUpdateDate: toDate(needToUpdateDate),
				...columnInfo,
			});

			eventEmitter.emit('create:fgab', {
				accountBookId,
				userNickname,
				column: newColumn,
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

export const createNewNotFixedColumn =
	(dependencies: TCreateNewNotFixedColumn['dependency']) =>
	async (info: TCreateNewNotFixedColumn['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			dateUtil: { toDate },
			repository: { createNewNFColumn, findGroup },
			eventEmitter,
		} = dependencies;

		try {
			const {
				accountBookId,
				userEmail,
				userNickname,
				spendingAndIncomeDate,
				...columnInfo
			} = info;

			const group = await findGroup({ accountBookId, userEmail });
			if (!group) {
				throw new Error('가계부에 등록되지 않은 사용자 입니다.');
			}
			if (group.userType === 'observer') {
				throw new Error('글쓰기 권한이 없는 사용자 입니다.');
			}

			const newColumn = await createNewNFColumn({
				groupId: group.id,
				spendingAndIncomeDate: toDate(spendingAndIncomeDate),
				...columnInfo,
			});

			eventEmitter.emit('create:nfgab', {
				accountBookId,
				userNickname,
				column: newColumn,
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
			dateUtil: { toDate },
			service: { checkAdminGroupUser },
			repository: { findFixedGAB, updateFColumn },
			eventEmitter,
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

			const updateInfo = {
				needToUpdateDate: toDate(needToUpdateDate),
				...columnInfo,
			};
			await updateFColumn(cgab, updateInfo);

			eventEmitter.emit('update:fgab', {
				accountBookId: cgab.groups.accountBookId,
				column: { id: cgab.id, ...updateInfo },
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
			dateUtil: { toDate },
			service: { checkAdminGroupUser },
			repository: { findNotFixedGAB, updateNFColumn },
			eventEmitter,
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

			const updateInfo = {
				...columnInfo,
				spendingAndIncomeDate: toDate(spendingAndIncomeDate),
			};
			await updateNFColumn(gab, updateInfo);

			eventEmitter.emit('update:nfgab', {
				accountBookId: gab.groups.accountBookId,
				column: { id: gab.id, ...updateInfo },
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
			eventEmitter,
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

			await deleteFColumn({ id });

			eventEmitter.emit('delete:fgab', {
				accountBookId: cgab.groups.accountBookId,
				column: { id },
			});
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
			eventEmitter,
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

			await deleteNFColumn({ id });

			eventEmitter.emit('delete:nfgab', {
				accountBookId: gab.groups.accountBookId,
				column: { id },
			});
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

			return {
				history: { notFixedList, fixedList },
				categoryList,
			} satisfies TGet['data'];
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
