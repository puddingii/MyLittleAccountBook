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

const publicColumn = {
	value: zod.number().min(1, '1원 이상 입력해야 합니다.'),
	type: zod.enum(['income', 'spending'], {
		required_error: '지출/수입 타입 정보가 필요합니다.',
		invalid_type_error: '지출 혹은 수입의 타입 정보가 아닙니다.',
	}),
	category: zod.number().min(0, '카테고리는 필수 항목입니다.'),
	content: zod.string().optional(),
};

const notFixedColumn = {
	...publicColumn,
	writeType: zod.literal(COLUMN_WRITE_TYPE.NOTFIXED, {
		required_error: '고정/지출 타입정보가 필요합니다.',
		invalid_type_error: '알 수 없는 타입입니다.',
	}),
	spendingAndIncomeDate: zod.string().datetime({ message: '날짜 형식이 아닙니다.' }),
};

const fixedColumn = {
	...publicColumn,
	writeType: zod.literal(COLUMN_WRITE_TYPE.FIXED, {
		required_error: '고정/지출 타입정보가 필요합니다.',
		invalid_type_error: '알 수 없는 타입입니다.',
	}),
	cycleTime: zod.number().min(0, '0 이하로 입력할 수 없습니다.'),
	cycleType: zod.enum(['sd', 'd', 'w', 'm', 'y'], {
		required_error: '고정주기 입력 시 필수 항목입니다.',
		invalid_type_error: '알 수 없는 주기입니다.',
	}),
};

const postNotFixedColumn = zod.object({ ...notFixedColumn, accountBookId: zod.number() });
const postFixedColumn = zod.object({ ...fixedColumn, accountBookId: zod.number() });

const postColumn = zod
	.discriminatedUnion('writeType', [postNotFixedColumn, postFixedColumn])
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

const publicOptionalColumn = {
	category: publicColumn.category.optional(),
	value: publicColumn.value.optional(),
	type: publicColumn.type.optional(),
	content: publicColumn.content,
};

const patchNotFixedColumn = zod.object({
	...publicOptionalColumn,
	writeType: notFixedColumn.writeType,
	spendingAndIncomeDate: notFixedColumn.spendingAndIncomeDate.optional(),
	gabId: zod.number(),
	accountBookId: zod.number(),
});

const patchFixedColumn = zod.object({
	...publicOptionalColumn,
	writeType: fixedColumn.writeType,
	cycleTime: zod.number().min(0, '0 이하로 입력할 수 없습니다.').optional(),
	cycleType: zod
		.enum(['sd', 'd', 'w', 'm', 'y'], {
			required_error: '고정주기 입력 시 필수 항목입니다.',
			invalid_type_error: '알 수 없는 주기입니다.',
		})
		.optional(),
	gabId: zod.number(),
	accountBookId: zod.number(),
});

const patchColumn = zod
	.discriminatedUnion('writeType', [patchNotFixedColumn, patchFixedColumn])
	.refine(
		data => {
			/** Fixed에서 cycleType, cycleTime 수정 시 둘 다 포함되어야 함 */
			if (
				data.writeType === COLUMN_WRITE_TYPE.FIXED &&
				(!data.cycleType || !data.cycleTime)
			) {
				return false;
			}

			if (
				data.writeType === COLUMN_WRITE_TYPE.FIXED &&
				data.cycleType &&
				data.cycleTime
			) {
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

const getColumnList = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
		startDate: zod.string(),
		endDate: zod.string(),
	}),
});

const deleteColumn = zod.object({
	query: zod.object({
		id: zod.string(),
		writeType: zod.enum([COLUMN_WRITE_TYPE.FIXED, COLUMN_WRITE_TYPE.NOTFIXED]),
	}),
});

const getSummary = zod.object({
	query: zod.object({
		accountBookId: zod.string(),
	}),
});

export type TGetCategoryQuery = zod.infer<typeof getCategory>;
export type TPostFixedColumnQuery = zod.infer<typeof postFixedColumn>;
export type TPostNotFixedColumnQuery = zod.infer<typeof postNotFixedColumn>;
export type TPostColumnQuery = zod.infer<typeof postColumn>;
export type TPatchColumnQuery = zod.infer<typeof patchColumn>;
export type TGetColumnListQuery = zod.infer<typeof getColumnList>;
export type TDeleteColumnQuery = zod.infer<typeof deleteColumn>;
export type TGetSummaryQuery = zod.infer<typeof getSummary>;

export default {
	getCategory,
	postColumn,
	patchColumn,
	getColumnList,
	deleteColumn,
	getSummary,
};
