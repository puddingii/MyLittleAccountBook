export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Get partial object except for specific values.
 * @example
 * RequiredPartial<{ a: string; b: number; c: boolean; }, 'a'> // { a: string; b?: number; c?: boolean }
 * RequiredPartial<{ a: string; b: number; c: boolean; }, 'a' | 'b'> // { a: string; b: number; c?: boolean }
 */
export type RequiredPartial<
	O extends { [key: string]: unknown },
	T extends keyof O,
> = Required<Pick<O, T>> & Omit<Partial<O>, T>;

export type PartialRequired<
	O extends { [key: string]: unknown },
	T extends keyof O,
> = Partial<Pick<O, T>> & Omit<Required<O>, T>;
