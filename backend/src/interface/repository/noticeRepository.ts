import { InferAttributes } from 'sequelize';
import NoticeModel from '@/model/notice';

import { RequiredPartial } from '..';
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

export type TUpdateNotice = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		NoticeModel: typeof NoticeModel;
	};
	param: RequiredPartial<InferAttributes<NoticeModel>, 'id'>;
};

export type TCreateNotice = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		NoticeModel: typeof NoticeModel;
	};
	param: Pick<InferAttributes<NoticeModel>, 'content' | 'title' | 'isUpdateContent'>;
};

export type TDeleteNotice = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		NoticeModel: typeof NoticeModel;
	};
	param: { id: number };
};
