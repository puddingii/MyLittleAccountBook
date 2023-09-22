/** Library */

/** Repository */
import {
	findOneAccountBook,
	updateAccountBook,
} from '@/repository/accountBookRepository';
import { findGroup } from '@/repository/groupRepository';

/** Sub Service */
import { isAdminUser } from '../common/user';

/** Interface */

/** Etc */
import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

export const getAccountBookInfo = async (info: {
	id?: number;
	title?: string;
	myEmail: string;
}) => {
	try {
		const { myEmail, ...accountBookInfo } = info;
		const myGroupInfo = await findGroup({ userEmail: myEmail, accountBookId: info.id });
		if (!myGroupInfo) {
			throw new Error('현재 계정은 해당 그룹에 참여하지 않아 정보를 불러올 수 없습니다.');
		}

		const accountBook = await findOneAccountBook(accountBookInfo);
		if (!accountBook) {
			throw new Error('가계부 정보를 찾을 수 없습니다.');
		}

		return { title: accountBook.title, content: accountBook.content };
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};

export const updateAccountBookInfo = async (info: {
	myEmail: string;
	title?: string;
	content?: string;
	accountBookId: number;
}) => {
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
		const customError = convertErrorToCustomError(error, { trace: 'Service', code: 400 });
		throw customError;
	}
};
