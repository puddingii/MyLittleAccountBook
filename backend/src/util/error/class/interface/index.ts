export type TContext =
	| string
	| number
	| boolean
	| null
	| undefined
	| readonly TContext[]
	| { readonly [key: string]: TContext }
	| { toJSON(): TContext };

export interface ICustomError extends Error {
	readonly code?: TContext;
	readonly traceList: Array<string>;

	/** 흔적 추가 */
	addTrace(trace: string): void;
}
