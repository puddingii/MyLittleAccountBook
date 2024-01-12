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
