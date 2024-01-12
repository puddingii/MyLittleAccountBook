import {
	TFindUserPrivacy,
	TUpdateUserPrivacy,
} from '@/interface/repository/userPrivacyRepository';

export const findUserPrivacy =
	(dependencies: TFindUserPrivacy['dependency']) =>
	async (info: TFindUserPrivacy['param']) => {
		const {
			UserPrivacyModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const userPrivacy = await UserPrivacyModel.findOne({
				where: { userEmail: info.userEmail },
			});

			return userPrivacy;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};

export const updateUserPrivacy =
	(dependencies: TUpdateUserPrivacy['dependency']) =>
	async (info: TUpdateUserPrivacy['param']) => {
		const {
			UserPrivacyModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { userEmail, ...rest } = info;
			const successCount = await UserPrivacyModel.update(rest, { where: { userEmail } });

			return successCount;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};
