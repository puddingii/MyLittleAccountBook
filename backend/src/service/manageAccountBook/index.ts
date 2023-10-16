/** Library */

/** Interface */
import {
	TGetAccountBookInfo,
	TUpdateAccountBookInfo,
} from '@/interface/service/manageAccountBookService';

export const getAccountBookInfo =
	(dependencies: TGetAccountBookInfo['dependency']) =>
	async (info: TGetAccountBookInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findGroup, findOneAccountBook },
		} = dependencies;

		try {
			const { myEmail, ...accountBookInfo } = info;
			const myGroupInfo = await findGroup({ userEmail: myEmail, accountBookId: info.id });
			if (!myGroupInfo) {
				throw new Error(
					'현재 계정은 해당 그룹에 참여하지 않아 정보를 불러올 수 없습니다.',
				);
			}

			const accountBook = await findOneAccountBook(accountBookInfo);
			if (!accountBook) {
				throw new Error('가계부 정보를 찾을 수 없습니다.');
			}

			return { title: accountBook.title, content: accountBook.content };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const updateAccountBookInfo =
	(dependencies: TUpdateAccountBookInfo['dependency']) =>
	async (info: TUpdateAccountBookInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError, CustomError },
			validationUtil: { isAdminUser },
			repository: { findGroup, updateAccountBook },
		} = dependencies;

		try {
			const { myEmail, ...accountBookInfo } = info;
			const myGroupInfo = await findGroup({
				userEmail: myEmail,
				accountBookId: info.accountBookId,
			});
			if (!myGroupInfo) {
				throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
			}
			if (!isAdminUser(myGroupInfo.userType)) {
				throw new Error('관리 가능한 유저가 아닙니다.');
			}

			const successCount = await updateAccountBook(accountBookInfo);
			if (successCount === 0) {
				throw new CustomError('성공적으로 변경되지 않았습니다.', { code: 500 });
			}
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
