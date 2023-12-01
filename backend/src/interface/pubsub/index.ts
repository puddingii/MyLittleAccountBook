export type TEventMap = Record<string, unknown>;

export type TEventKey<T extends TEventMap> = string & keyof T;
export type TEventReceiver<T> = (params: T) => void;

export interface IEmitter<T extends TEventMap> {
	on<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>): void;
	once<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>): void;
	off<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>): void;
	emit<K extends TEventKey<T>>(eventName: K, params: T[K]): void;
}
