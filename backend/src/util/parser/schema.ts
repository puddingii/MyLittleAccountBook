import * as zod from 'zod';

export default {
	auth: {
		socialLogin: zod.object({
			query: zod.object({
				type: zod.enum(['Naver', 'Google'], {
					required_error: '소셜 로그인의 종류 정보가 필요합니다.',
					invalid_type_error: '구글, 네이버 소셜 로그인만 가능합니다.',
				}),
			}),
		}),
		googleLogin: zod.object({
			query: zod.object({
				error: zod.string().optional(),
				code: zod.string().optional(),
			}),
		}),
	},
};
