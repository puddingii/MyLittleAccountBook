import { object, string } from 'yup';

const updateAccountBookSchema = object().shape({
	title: string().max(20, '최대 20자를 넘길 수 없습니다.').required('제목은 필수 항목입니다.'),
	content: string().max(100, '최대 100자를 넘길 수 없습니다.').optional(),
});

export { updateAccountBookSchema };
