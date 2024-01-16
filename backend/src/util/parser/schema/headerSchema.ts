import * as zod from 'zod';

const getAccountBook = zod.object({
	query: zod.object({
		id: zod.string().optional(),
		title: zod.string().optional(),
	}),
});

const postAccountBook = zod.object({
	body: zod.object({
		title: zod.string(),
		content: zod.string().optional(),
		invitedUserList: zod.array(
			zod.object({
				email: zod.string().email('이메일 유형이 아닙니다.'),
				type: zod.enum(['manager', 'writer', 'observer'], {
					required_error: '초대한 유저별 타입이 누락되었습니다.',
					invalid_type_error: '알 수 없는 유저 권한이 있습니다.',
				}),
			}),
		),
	}),
});

const patchAccountBook = zod.object({
	body: zod.object({
		title: zod.string().optional(),
		content: zod.string().optional(),
		accountBookId: zod.number(),
	}),
});

const getNotice = zod.object({
	query: zod.object({
		id: zod.string({ required_error: 'id값이 누락되었습니다.' }),
	}),
});

const getNoticeList = zod.object({
	query: zod.object({
		limit: zod.string({ required_error: '한 페이지당 게시물 카운트가 누락되었습니다.' }),
		page: zod.string({ required_error: '현재 페이지 값이 누락되었습니다.' }),
	}),
});

const postNotice = zod.object({
	body: zod.object({
		title: zod.string({ required_error: '공지 제목이 누락되었습니다.' }),
		content: zod.string({ required_error: '공지 내용이 누락되었습니다.' }),
		isUpdateContent: zod.boolean({
			required_error: '공지or업데이트 여부가 누락되었습니다.',
		}),
	}),
});

const patchNotice = zod.object({
	body: zod.object({
		id: zod.number({ required_error: '수정할 공지 Id가 누락되었습니다.' }),
		title: zod.string().optional(),
		content: zod.string().optional(),
		isUpdateContent: zod.boolean().optional(),
	}),
});

const deleteNotice = zod.object({
	query: zod.object({
		id: zod.string({ required_error: '수정할 공지 Id가 누락되었습니다.' }),
	}),
});

export type TGetAccountBookQuery = zod.infer<typeof getAccountBook>;
export type TPostAccountBookQuery = zod.infer<typeof postAccountBook>;
export type TPatchAccountBookQuery = zod.infer<typeof patchAccountBook>;
export type TGetNotice = zod.infer<typeof getNotice>;
export type TGetNoticeList = zod.infer<typeof getNoticeList>;
export type TPostNotice = zod.infer<typeof postNotice>;
export type TPatchNotice = zod.infer<typeof patchNotice>;
export type TDeleteNotice = zod.infer<typeof deleteNotice>;

export default {
	getAccountBook,
	postAccountBook,
	patchAccountBook,
	getNotice,
	getNoticeList,
	postNotice,
	patchNotice,
	deleteNotice,
};
