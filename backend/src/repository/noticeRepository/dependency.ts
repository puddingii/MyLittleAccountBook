import * as Logic from '.';

/** Model */
import NoticeModel from '@/model/notice';

import { convertErrorToCustomError } from '@/util/error';

export const findOneNotice = Logic.findOneNotice({
	NoticeModel,
	errorUtil: { convertErrorToCustomError },
});

export const findNoticeList = Logic.findNoticeList({
	NoticeModel,
	errorUtil: { convertErrorToCustomError },
});

export const updateNotice = Logic.updateNotice({
	NoticeModel,
	errorUtil: { convertErrorToCustomError },
});

export const createNotice = Logic.createNotice({
	NoticeModel,
	errorUtil: { convertErrorToCustomError },
});

export const deleteNotice = Logic.deleteNotice({
	NoticeModel,
	errorUtil: { convertErrorToCustomError },
});
