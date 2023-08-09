import { TContext, ICustomError } from './interface';

export class CustomError extends Error implements ICustomError {
	public readonly code: number;
	public readonly context?: TContext;
	public readonly traceList: Array<string>;

	constructor(
		message: string,
		options: {
			cause?: unknown;
			context?: TContext;
			traceList?: Array<string>;
			code: number;
		},
	) {
		const { cause, context, traceList, code } = options;

		super(message, { cause });
		this.name = this.constructor.name;

		this.context = context;
		this.traceList = traceList ?? [];
		this.code = code;
	}

	addTrace(trace: string) {
		this.traceList.unshift(trace);
	}
}
