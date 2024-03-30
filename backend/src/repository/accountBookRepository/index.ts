import {
	TCreateAccountBook,
	TFindOneAccountBook,
	TFindOneAccountBookWithImage,
	TUpdateAccountBook,
} from '@/interface/repository/accountBookRepository';

export const findOneAccountBook =
	(dependencies: TFindOneAccountBook['dependency']) =>
	async (info: Partial<{ id: number; title: string }>) => {
		const {
			AccountBookModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const accountBook = await AccountBookModel.findOne({
				where: info,
			});

			return accountBook;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

export const findOneAccountBookWithImage =
	(dependencies: TFindOneAccountBookWithImage['dependency']) =>
	async (info: Partial<{ id: number; title: string }>) => {
		const {
			AccountBookModel,
			AccountBookMediaModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const accountBook = await AccountBookModel.findOne({
				where: info,
				include: [
					{
						model: AccountBookMediaModel,
						as: 'accountbookmedias',
						required: false,
						where: {
							isSaved: true,
						},
						attributes: ['path', 'name'],
					},
				],
				subQuery: false,
			});

			return accountBook;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

/** 새로운 가계부 생성 */
export const createAccountBook =
	(dependencies: TCreateAccountBook['dependency']) =>
	async (
		info: TCreateAccountBook['param'][0],
		transaction?: TCreateAccountBook['param'][1],
	) => {
		const {
			AccountBookModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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

export const updateAccountBook =
	(dependencies: TUpdateAccountBook['dependency']) =>
	async (
		info: TUpdateAccountBook['param'][0],
		transaction?: TUpdateAccountBook['param'][1],
	) => {
		const {
			AccountBookModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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
