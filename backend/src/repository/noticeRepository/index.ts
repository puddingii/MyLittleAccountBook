import {
	TCreateNotice,
	TDeleteNotice,
	TFindNoticeList,
	TFindOneNotice,
	TUpdateNotice,
} from '@/interface/repository/noticeRepository';

export const findOneNotice =
	(dependencies: TFindOneNotice['dependency']) =>
	async (info: TFindOneNotice['param']) => {
		const {
			NoticeModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const notice = await NoticeModel.findOne({
				where: info,
			});

			return notice;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

export const findNoticeList =
	(dependencies: TFindNoticeList['dependency']) =>
	async (info: TFindNoticeList['param']) => {
		const {
			NoticeModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { limit, page } = info;
			const result = await NoticeModel.findAndCountAll({
				limit,
				offset: page > 1 ? limit * (page - 1) : 0,
				order: [['createdAt', 'DESC']],
			});

			return result;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
				code: 400,
			});
			throw customError;
		}
	};

export const updateNotice =
	(dependencies: TUpdateNotice['dependency']) => async (info: TUpdateNotice['param']) => {
		const {
			NoticeModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

		try {
			const { id, ...rest } = info;
			const successCount = await NoticeModel.update(rest, { where: { id } });

			return successCount;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};

export const createNotice =
	(dependencies: TCreateNotice['dependency']) => async (info: TCreateNotice['param']) => {
		const {
			NoticeModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;
		try {
			const newNotice = await NoticeModel.create(info);

			return newNotice;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};

export const deleteNotice =
	(dependencies: TDeleteNotice['dependency']) => async (info: TDeleteNotice['param']) => {
		const {
			NoticeModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;
		try {
			const deleteCount = await NoticeModel.destroy({ where: info });

			return deleteCount;
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Repository',
			});
			throw customError;
		}
	};
