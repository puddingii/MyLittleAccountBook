import EventEmitter from 'events';

type TEventMap = Record<string, unknown>;

type TEventKey<T extends TEventMap> = string & keyof T;
type TEventReceiver<T> = (params: T) => void;

interface IEmitter<T extends TEventMap> {
	on<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>): void;
	once<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>): void;
	off<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>): void;
	emit<K extends TEventKey<T>>(eventName: K, params: T[K]): void;
}

export default class TypeEmitter<T extends TEventMap> implements IEmitter<T> {
	private emitter = new EventEmitter();
	emit<K extends TEventKey<T>>(eventName: K, params: T[K]) {
		this.emitter.emit(eventName, params);
	}

	off<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>) {
		this.emitter.off(eventName, fn);
	}

	on<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>) {
		this.emitter.on(eventName, fn);
	}

	once<K extends TEventKey<T>>(eventName: K, fn: TEventReceiver<T[K]>) {
		this.emitter.once(eventName, fn);
	}
}
