import { InferAttributes } from 'sequelize';

import NoticeModel from '@/model/notice';
import { TResponseType } from '@/interface/api/response';

type TNoticeModel = InferAttributes<NoticeModel>;

export type TGet = TResponseType<TNoticeModel>;

export type TGetList = TResponseType<{ count: number; list: Array<TNoticeModel> }>;

export type TPost = TResponseType<
	Pick<
		InferAttributes<NoticeModel>,
		'content' | 'title' | 'isUpdateContent' | 'id' | 'createdAt'
	>
>;

export type TPatch = TResponseType<{ count: Array<number> }>;
export type TDelete = TResponseType<{ count: number }>;
