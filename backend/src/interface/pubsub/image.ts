import type { Readable } from 'stream';
import { IEmitter } from '.';

export type TImageEvent = {
	upload: {
		stream: Readable;
		path: string;
		id: number;
		name: string;
	};
};

export type TImageEventEmitter = IEmitter<TImageEvent>;
