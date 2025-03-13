import { IEmitter } from '.';

export type TImageEvent = {
	upload: {
		buffer: Buffer;
		mimeType: string;
		path: string;
		id: number;
		name: string;
		beforeName?: string;
	};
};

export type TImageEventEmitter = IEmitter<TImageEvent>;
