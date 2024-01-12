import { TFindNoticeList, TFindOneNotice } from '@/interface/repository/noticeRepository';

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
				offset: page > 1 ? limit * (page - 1) : page,
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
