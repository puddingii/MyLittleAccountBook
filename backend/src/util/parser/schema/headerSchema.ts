import * as zod from 'zod';

const postAccountBook = zod.object({
	body: zod.object({
		title: zod.string(),
		content: zod.string().optional(),
		invitedUserList: zod.array(
			zod.object({
				email: zod.string(),
				type: zod.enum(['manager', 'writer', 'observer'], {
					required_error: '초대한 유저별 타입이 누락되었습니다.',
					invalid_type_error: '알 수 없는 유저 권한이 있습니다.',
				}),
			}),
		),
	}),
});
export type TPostAccountBookQuery = zod.infer<typeof postAccountBook>;

export default {
	postAccountBook,
};
