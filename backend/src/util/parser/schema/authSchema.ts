import * as zod from 'zod';

const socialLogin = zod.object({
	query: zod.object({
		type: zod.enum(['Naver', 'Google'], {
			required_error: '소셜 로그인의 종류 정보가 필요합니다.',
			invalid_type_error: '구글, 네이버 소셜 로그인만 가능합니다.',
		}),
	}),
});

const googleLogin = zod.object({
	body: zod.object({
		error: zod.string().optional(),
		code: zod.string().optional(),
		state: zod.string({
			required_error: '소셜 로그인에 필요한 정보가 누락되었습니다. 다시 로그인 해주세요.',
		}),
		authuser: zod.string().optional(),
		scope: zod.string().optional(),
		prompt: zod.string().optional(),
	}),
});

const naverLogin = zod.object({
	body: zod.object({
		code: zod.string().optional(),
		state: zod.string({
			required_error: '소셜 로그인에 필요한 정보가 누락되었습니다. 다시 로그인 해주세요.',
		}),
		error: zod.string().optional(),
		error_description: zod.string().optional(),
	}),
});

const emailLogin = zod.object({
	body: zod.object({
		email: zod
			.string({ required_error: '이메일 정보가 누락되었습니다.' })
			.email('이메일 형식이 아닙니다.'),
		password: zod.string({ required_error: '패스워드 정보가 누락되었습니다.' }),
	}),
});

const join = zod.object({
	body: zod.object({
		email: zod
			.string({ required_error: '이메일 정보가 누락되었습니다.' })
			.trim()
			.email('이메일 형식이 아닙니다.')
			.max(255, '입력할 수 있는 길이를 넘었습니다.'),
		password: zod
			.string({ required_error: '패스워드 정보가 누락되었습니다.' })
			.regex(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].{7,}$/,
				'최소 8자 이상, 각각 최소 하나의 대/소문자, 숫자, 특수 문자가 포함되어야 합니다.',
			)
			.trim()
			.max(255, '입력할 수 있는 길이를 넘었습니다.'),
		nickname: zod
			.string({ required_error: '닉네임 정보가 누락되었습니다.' })
			.max(255, '입력할 수 있는 길이를 넘었습니다.'),
	}),
});

const tokenInfo = zod.object({
	headers: zod.object({
		refresh: zod.string({ required_error: 'Refresh token is expired.' }),
		authorization: zod
			.string({ required_error: 'Access token is expired.' })
			.refine(data => data.split(' ')[0] === 'Bearer', 'Token type error'),
	}),
});

const verifyEmail = zod.object({
	body: zod.object({
		emailState: zod.string({
			required_error: 'State 정보가 누락되었습니다. 이메일 인증 재요청 부탁드립니다.',
		}),
		userEmail: zod.string({
			required_error: 'Email 정보가 누락되었습니다. 이메일 인증 재요청 부탁드립니다.',
		}),
	}),
});

export type TSocialQuery = zod.infer<typeof socialLogin>;
export type TGoogleQuery = zod.infer<typeof googleLogin>;
export type TNaverQuery = zod.infer<typeof naverLogin>;
export type TEmailQuery = zod.infer<typeof emailLogin>;
export type TTokenQuery = zod.infer<typeof tokenInfo>;
export type TJoinQuery = zod.infer<typeof join>;
export type TVerifyEmailQuery = zod.infer<typeof verifyEmail>;

export default {
	socialLogin,
	emailLogin,
	googleLogin,
	naverLogin,
	tokenInfo,
	join,
	verifyEmail,
};
