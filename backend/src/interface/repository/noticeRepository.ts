import NoticeModel from '@/model/notice';

import { TErrorUtil } from '../util';

export type TFindOneNotice = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		NoticeModel: typeof NoticeModel;
	};
	param: { id: number };
};

export type TFindNoticeList = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		NoticeModel: typeof NoticeModel;
	};
	param: { page: number; limit: number };
};
