import { ILogger } from '../class/interface';

export type TLoggerInfoKey = 'prod' | 'dev' | 'full';
export type TLoggerInfo = Record<TLoggerInfoKey, () => ILogger>;
