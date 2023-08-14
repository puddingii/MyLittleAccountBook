import { object, string, number } from 'yup';

const incomeAndSpendingSchema = object().shape({
	type: string()
		.matches(/^income$|^spending$/, { message: '정의되지 않은 타입입니다.' })
		.required('타입은 필수 항목입니다.'),
	category: string().max(255).required('카테고리는 필수 항목입니다.'),
	subCategory: string().max(255).optional(),
	value: number().max(255).required('금액은 필수 항목입니다.'),
	content: string().max(255).optional(),
});

export { incomeAndSpendingSchema };
