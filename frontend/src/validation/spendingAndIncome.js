import { object, string, number, mixed, date } from 'yup';

const notFixedWriterSchema = object().shape({
	writeType: string().matches(/^nf$/).required(),
	type: mixed()
		.oneOf(['income', 'spending'], '정의되지 않은 타입입니다.')
		.defined()
		.required('타입은 필수 항목입니다.'),
	category: number().min(1, '카테고리는 필수 항목입니다.').required('카테고리는 필수 항목입니다.'),
	value: number().min(1, '1원 이상 입력할 수 있습니다.').required('금액은 필수 항목입니다.'),
	content: string().max(100, '최대 100자를 넘길 수 없습니다.').optional(),
	spendingAndIncomeDate: date().required('날짜는 필수 항목입니다.'),
});

const fixedWriterSchema = object().shape({
	writeType: string().matches(/^f$/).required(),
	type: mixed()
		.oneOf(['income', 'spending'], '정의되지 않은 타입입니다.')
		.defined()
		.required('타입은 필수 항목입니다.'),
	category: number().min(1, '카테고리는 필수 항목입니다.').required('카테고리는 필수 항목입니다.'),
	value: number().min(1, '1원 이상 입력해야 합니다.').required('금액은 필수 항목입니다.'),
	content: string().max(100, '최대 100자를 넘길 수 없습니다.').optional(),
	cycleTime: number()
		.when('cycleType', {
			is: type => type === 'sd',
			then: schema =>
				schema.max(28, '특정 날짜 기록은 28일 초과로 입력할 수 없습니다.').min(1, '1일 이상으로 등록할 수 있습니다'),
			otherwise: schema =>
				schema.max(365, '365일 초과로 입력할 수 없습니다.').min(1, '1일 이상으로 등록할 수 있습니다'),
		})
		.required('고정기록 입력 시 필수 항목입니다.'),
	/**
	 * 공통 특징 : 시간은 고려하지 않고 0시 기준
	 * 특정 일마다 : 1~28일까지, Type : sd
	 *
	 * n주기로 숫자는 365 최대
	 * 일마다 : 24시간 기준, Type : d
	 * 주마다 : 7일 기준, Type: w
	 * 월마다 : 30일 기준, type : m
	 * 년마다 : 365일 기준, type : y
	 */
	cycleType: mixed()
		.oneOf(['sd', 'd', 'w', 'm', 'y'], '알 수 없는 주기입니다.')
		.defined()
		.required('고정주기 입력 시 필수 항목입니다.'),
});

export { notFixedWriterSchema, fixedWriterSchema };
