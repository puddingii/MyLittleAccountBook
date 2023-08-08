import { TContext, ICustomError } from './interface';

export class CustomError extends Error implements ICustomError {
	public readonly code?: TContext;
	public readonly traceList: Array<string>;

	constructor(
		message: string,
		options: { cause?: unknown; code?: TContext; traceList?: Array<string> } = {},
	) {
		const { cause, code, traceList } = options;

		super(message, { cause });
		this.name = this.constructor.name;

		this.code = code;
		this.traceList = traceList ?? [];
	}

	addTrace(trace: string) {
		this.traceList.unshift(trace);
	}
}
