import { object, string } from 'yup';

const categorySchema = object().shape({
	name: string().max(10, '최대 10자를 넘길 수 없습니다.').required('필수 항목입니다.'),
});

export { categorySchema };
