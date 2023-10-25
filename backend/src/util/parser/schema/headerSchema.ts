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

export type TGetAccountBookQuery = zod.infer<typeof getAccountBook>;
export type TPostAccountBookQuery = zod.infer<typeof postAccountBook>;
export type TPatchAccountBookQuery = zod.infer<typeof patchAccountBook>;

export default {
	getAccountBook,
	postAccountBook,
	patchAccountBook,
};
