import { Dayjs } from 'dayjs';

export type TUserInfo = { nickname: string; email: string; password: string };

/** sd : 각 월의 'n' 일 */
export type TDayOfMonth = 'sd';

/**
 * d : 'n' 일 마다,
 * w : 'n * 7' 일 마다,
 * m : 'n * 30' 일 마다,
 * y : 'n * 365' 일 마다,
 */
export type TEveryOfType = 'd' | 'w' | 'm' | 'y';

/**
 * sd : 각 월의 'n' 일,
 * d : 'n' 일 마다,
 * w : 'n * 7' 일 마다,
 * m : 'n * 30' 일 마다,
 * y : 'n * 365' 일 마다,
 */
export type TCycleType = TDayOfMonth | TEveryOfType;

/** 갱신 주기관련 정보 타입 */
export type TCycleInfo = { cycleType: TCycleType; cycleTime: number };
/** Day Of Month  */
export type TCycleDInfo = { cycleType: TDayOfMonth; cycleTime: number };
/** Every Of  */
export type TCycleEInfo = { cycleType: TEveryOfType; cycleTime: number };

/** Date형식이 될 수 있는 타입들. undefined의 경우 현재 날짜로 리턴하게 유도 */
export type TDate = string | Dayjs | Date | undefined;

/** "수입 | 지출"의 타입 */
export type TColumnType = 'income' | 'spending';
