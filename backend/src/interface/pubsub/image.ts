import { IEmitter } from '.';

export type TImageEvent = {
	upload: {
		buffer: Buffer;
		path: string;
		id: number;
		name: string;
		beforeName?: string;
	};
};

export type TImageEventEmitter = IEmitter<TImageEvent>;
