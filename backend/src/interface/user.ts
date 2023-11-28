export type TUserInfo = { nickname: string; email: string; password: string };
/**
 * sd : 각 월의 'n' 일
 * d : 'n' 일 마다
 * w : 'n * 7' 일 마다
 * m : 'n * 30' 일 마다
 * y : 'n * 365' 일 마다
 */
export type TCycleType = 'sd' | 'd' | 'w' | 'm' | 'y';
