import {
	TCreateAccountBookMedia,
	TDeleteAccountBookMedia,
	TFindOneAccountBookMedia,
	TUpdateAccountBookMedia,
} from '@/interface/repository/accountBookMediaRepository';

export const findOneAccountBookMedia =
	(dependencies: TFindOneAccountBookMedia['dependency']) =>
	async (
		info: TFindOneAccountBookMedia['param'][0],
		transaction?: TFindOneAccountBookMedia['param'][1],
	) => {
		const {
			AccountBookMediaModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const accountBookMedia = await AccountBookMediaModel.findOne({
				where: info,
				transaction,
			});

			return accountBookMedia;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

export const createAccountBookMedia =
	(dependencies: TCreateAccountBookMedia['dependency']) =>
	async (
		info: TCreateAccountBookMedia['param'][0],
		transaction?: TCreateAccountBookMedia['param'][1],
	) => {
		const {
			AccountBookMediaModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const accountBookMedia = await AccountBookMediaModel.create(
				{
					...info,
				},
				{ transaction },
			);

			return accountBookMedia;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

export const updateAccountBookMedia =
	(dependencies: TUpdateAccountBookMedia['dependency']) =>
	async (
		info: TUpdateAccountBookMedia['param'][0],
		transaction?: TUpdateAccountBookMedia['param'][1],
	) => {
		const {
			AccountBookMediaModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { accountBookId, id, ...updatedInfo } = info;
			const updatedCount = await AccountBookMediaModel.update(updatedInfo, {
				where: { id, accountBookId },
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

export const deleteAccountBookMedia =
	(dependencies: TDeleteAccountBookMedia['dependency']) =>
	async (
		info: TDeleteAccountBookMedia['param'][0],
		transaction?: TDeleteAccountBookMedia['param'][1],
	) => {
		const {
			AccountBookMediaModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const updatedCount = await AccountBookMediaModel.destroy({
				where: info,
				transaction,
			});

			return updatedCount;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};
