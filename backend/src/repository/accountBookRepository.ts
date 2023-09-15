import { Transaction } from 'sequelize';

import AccountBookModel from '@/model/accountBook';
import { convertErrorToCustomError } from '@/util/error';

/** 새로운 가계부 생성 */
export const createAccountBook = async (
	info: {
		title: string;
		content?: string;
	},
	transaction?: Transaction,
) => {
	try {
		const newAccountBook = await AccountBookModel.create(
			{
				title: info.title,
				content: info.content,
			},
			{ transaction },
		);

		return newAccountBook;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
		});
		throw customError;
	}
};

export const updateAccountBook = async (
	info: { title?: string; content?: string; accountBookId: number },
	transaction?: Transaction,
) => {
	try {
		const { accountBookId, ...updatedInfo } = info;
		const updatedCount = await AccountBookModel.update(updatedInfo, {
			where: { id: accountBookId },
			transaction,
		});

		return updatedCount[0];
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
		});
		throw customError;
	}
};
