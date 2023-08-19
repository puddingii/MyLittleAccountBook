import { object, string, number } from 'yup';

const incomeAndSpendingSchema = object().shape({
	type: string()
		.matches(/^income$|^spending$/, { message: '정의되지 않은 타입입니다.' })
		.required('타입은 필수 항목입니다.'),
	category: string().min(1, '카테고리는 필수 항목입니다.').required('카테고리는 필수 항목입니다.'),
	value: number().min(1, '1원 이상 입력할 수 있습니다.').required('금액은 필수 항목입니다.'),
	content: string().max(100, '최대 100자를 넘길 수 없습니다.').optional(),
});

export { incomeAndSpendingSchema };
