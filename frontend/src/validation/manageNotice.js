import { object, string } from 'yup';

const manageNoticeSchema = object().shape({
	title: string().max(20, '최대 20자를 넘길 수 없습니다.').required('제목은 필수 항목입니다.'),
	content: string().required('내용은 필수입니다.'),
});

export { manageNoticeSchema };
