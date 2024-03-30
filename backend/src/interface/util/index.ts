import type * as ErrorUtil from '@/util/error';
import type * as ErrorClass from '@/util/error/class';
import type DateUtil from '@/util/date';
import type * as JwtUtil from '@/util/jwt';
import type * as ValidationUtil from '@/util/validation/user';
import type * as MailerClass from '@/util/mail';
import type * as MailerUtil from '@/util/mail/html';
import type * as StringUtil from '@/util/string';

export type TErrorUtil = typeof ErrorUtil & typeof ErrorClass;
export type TDateUtil = typeof DateUtil;
export type TCacheUtil = {
	/** time 기본값은 600 */
	setCache: (
		key: string,
		value: number | string | Buffer,
		time?: number,
	) => Promise<void>;
	/** 캐시 삭제 */
	deleteCache: (key: string | Array<string>) => Promise<number>;
	/** 캐싱된 Key를 기준으로 Value 리턴 */
	getCache: (key: string) => Promise<string | null>;
};
export type TJwtUtil = typeof JwtUtil;
export type TValidationUtil = typeof ValidationUtil;
export type TMailUtil = typeof MailerUtil & typeof MailerClass;
export type TStringUtil = typeof StringUtil;
