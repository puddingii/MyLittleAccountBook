import { IEmitter } from '.';

export type TAuthEvent = {
	join: { email: string; nickname: string };
};

export type TAuthEventEmitter = IEmitter<TAuthEvent>;
