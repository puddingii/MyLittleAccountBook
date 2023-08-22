import type { Request } from 'express';
import {
	AnyZodObject,
	z,
	ZodEffects,
	ZodDiscriminatedUnion,
	ZodDiscriminatedUnionOption,
	ZodOptional,
	ZodType,
} from 'zod';

import { Entries } from '@/interface';

type TDiscriminatedUnion = ZodDiscriminatedUnion<
	string,
	Array<ZodDiscriminatedUnionOption<string>>
>;

const zParser = async <
	T extends AnyZodObject | ZodEffects<AnyZodObject> | ZodEffects<TDiscriminatedUnion>,
>(
	schema: T,
	req: Request | Request['body'],
): Promise<z.infer<T>> => {
	const parsedRequest = await schema.parseAsync(req);
	return parsedRequest;
};

export const convertToPartial = <T extends Record<string, ZodType>>(
	obj: T,
	excludeList: Array<keyof T>,
) => {
	const optionalObj = (Object.entries(obj) as Entries<T>).reduce(
		(acc, [key, value]) => {
			const isExcludeKey = excludeList.includes(key);
			if (isExcludeKey) {
				return { ...acc, [key]: value };
			}
			return { ...acc, [key]: value.optional() };
		},
		{} as {
			[key in keyof T]: ZodOptional<T[key]>;
		},
	);

	return optionalObj;
};

export default zParser;
