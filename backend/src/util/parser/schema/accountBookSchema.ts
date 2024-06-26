import * as zod from 'zod';
import internal from 'stream';

import { getCurrentDate, isGreater } from '@/util/date';
import { FileMaximumSize } from '@/enum';

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
	needToUpdateDate: zod.string().datetime({ message: '날짜 형식이 아닙니다.' }),
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
	)
	.refine(
		data => {
			if (data.writeType === COLUMN_WRITE_TYPE.FIXED) {
				return isGreater(data.needToUpdateDate, getCurrentDate());
			}
			return true;
		},
		{
			message: '업데이트 날짜는 현재 날짜 + 1일부터 가능합니다.',
			path: ['needToUpdateDate'],
		},
	);

const publicOptionalColumn = {
	category: publicColumn.category.optional(),
	value: publicColumn.value.optional(),
	type: publicColumn.type.optional(),
	content: publicColumn.content,
	gabId: zod.number(),
	accountBookId: zod.number(),
};

const patchNotFixedColumn = zod.object({
	...publicOptionalColumn,
	writeType: notFixedColumn.writeType,
	spendingAndIncomeDate: notFixedColumn.spendingAndIncomeDate.optional(),
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
	needToUpdateDate: fixedColumn.needToUpdateDate.optional(),
});

const patchColumn = zod
	.discriminatedUnion('writeType', [patchNotFixedColumn, patchFixedColumn])
	.refine(
		data => {
			/** Fixed에서 cycleType, cycleTime 수정 시 둘 다 포함되어야 함 */
			if (
				data.writeType === COLUMN_WRITE_TYPE.FIXED &&
				((!data.cycleType && data.cycleTime) || (data.cycleType && !data.cycleTime))
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
	)
	.refine(
		data => {
			if (data.writeType === COLUMN_WRITE_TYPE.FIXED && data.needToUpdateDate) {
				return isGreater(data.needToUpdateDate, getCurrentDate());
			}
			return true;
		},
		{
			message: '업데이트 날짜는 현재 날짜 + 1일부터 가능합니다.',
			path: ['needToUpdateDate'],
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

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const postImage = zod.object({
	file: zod
		.object({
			name: zod.string(),
			stream: zod.custom<internal.Readable>(),
			encoding: zod.string(),
			filename: zod.string(),
			mimeType: zod.string(),
			size: zod.number(),
			buffer: zod.custom<Buffer>(),
		})
		.refine(
			file => file.size <= FileMaximumSize.AccountBookImage,
			`Max file size is 5MB.`,
		)
		.refine(
			files => ACCEPTED_IMAGE_TYPES.includes(files.mimeType),
			'.jpg, .jpeg, .png files are accepted.',
		)
		.refine(files => Buffer.isBuffer(files.buffer), 'stream to buffer error...'),
	body: zod.object({
		accountBookId: zod.string(),
	}),
});

export type TGetCategoryQuery = zod.infer<typeof getCategory>;
export type TPostFixedColumnQuery = zod.infer<typeof postFixedColumn>;
export type TPostNotFixedColumnQuery = zod.infer<typeof postNotFixedColumn>;
export type TPostColumnQuery = zod.infer<typeof postColumn>;
export type TPatchFixedColumnQuery = zod.infer<typeof patchFixedColumn>;
export type TPatchNotFixedColumnQuery = zod.infer<typeof patchNotFixedColumn>;
export type TPatchColumnQuery = zod.infer<typeof patchColumn>;
export type TGetColumnListQuery = zod.infer<typeof getColumnList>;
export type TDeleteColumnQuery = zod.infer<typeof deleteColumn>;
export type TGetSummaryQuery = zod.infer<typeof getSummary>;
export type TPostImageQuery = zod.infer<typeof postImage>;

export default {
	getCategory,
	postColumn,
	patchColumn,
	getColumnList,
	deleteColumn,
	getSummary,
	postImage,
};
