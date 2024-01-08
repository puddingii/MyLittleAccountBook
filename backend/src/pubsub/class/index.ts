import EventEmitter from 'events';

import { IEmitter, TEventKey, TEventMap, TEventReceiver } from '@/interface/pubsub';

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
