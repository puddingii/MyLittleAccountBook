import { object, string } from 'yup';

const userSchema = object().shape({
	nickname: string().max(255).required('닉네임은 필수 입력 항목입니다.'),
	email: string().email('이메일 형식이 아닙니다.').max(255).required('이메일은 필수 입력 항목입니다.'),
	password: string()
		.max(255)
		.matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&].{7,}$/, {
			message: '최소 8자 이상, 각각 최소 하나의 대/소문자, 숫자, 특수 문자가 포함되어야 합니다.',
		})
		.required('비밀번호는 필수 입력 항목입니다.'),
});

const loginSchema = object().shape({
	email: string().email('이메일 형식이 아닙니다.').max(255).required('이메일은 필수 입력 항목입니다.'),
	password: string().max(255).required('비밀번호는 필수 입력 항목입니다.'),
});
const joinSchema = userSchema.clone();

export { userSchema, loginSchema, joinSchema };
