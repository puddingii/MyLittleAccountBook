import * as zod from 'zod';

const getCategory = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
	}),
});

export const COLUMN_WRITE_TYPE: { FIXED: 'f'; NOTFIXED: 'nf' } = {
	FIXED: 'f',
	NOTFIXED: 'nf',
};

const publicColumn = zod.object({
	value: zod.number().min(1, '1원 이상 입력해야 합니다.'),
	type: zod.enum(['income', 'spending'], {
		required_error: '지출/수입 타입 정보가 필요합니다.',
		invalid_type_error: '지출 혹은 수입의 타입 정보가 아닙니다.',
	}),
	category: zod.number().min(0, '카테고리는 필수 항목입니다.'),
	content: zod.string().optional(),
});

const notFixedColumn = publicColumn.extend({
	writeType: zod.literal(COLUMN_WRITE_TYPE.NOTFIXED),
	spendingAndIncomeDate: zod.string().datetime({ message: '날짜 형식이 아닙니다.' }),
});

const fixedColumn = publicColumn.extend({
	writeType: zod.literal(COLUMN_WRITE_TYPE.FIXED),
	cycleTime: zod.number().min(0, '0 이하로 입력할 수 없습니다.'),
	cycleType: zod.enum(['sd', 'd', 'w', 'm', 'y'], {
		required_error: '고정주기 입력 시 필수 항목입니다.',
		invalid_type_error: '알 수 없는 주기입니다.',
	}),
});

const postColumn = zod
	.discriminatedUnion('writeType', [notFixedColumn, fixedColumn])
	.refine(
		data => {
			if (data.writeType === COLUMN_WRITE_TYPE.FIXED) {
				const { cycleTime, cycleType } = data;
				return (
					(cycleType === 'sd' && cycleTime <= 28) ||
					(cycleType !== 'sd' && cycleTime <= 365)
				);
			}
			return true;
		},
		{
			message:
				'특정일 선택할 시 주기 날짜 <= 28일 / 특정일이 아닌 경우 주기 날짜 <= 365일',
			path: ['cycleTime'],
		},
	);

export type TGetCategoryQuery = zod.infer<typeof getCategory>;
export type TPostColumnQuery = zod.infer<typeof postColumn>;

export default { getCategory, postColumn };
