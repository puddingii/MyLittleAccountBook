import { object, string } from 'yup';

const createGroupSchema = object().shape({
	title: string().max(20, '최대 20자를 넘길 수 없습니다.').required('제목은 필수 항목입니다.'),
	content: string().max(100, '최대 100자를 넘길 수 없습니다.').optional(),
});
const inviteUserSchema = object().shape({
	email: string().email('이메일 형식이 아닙니다.').max(255),
});

export { createGroupSchema, inviteUserSchema };
