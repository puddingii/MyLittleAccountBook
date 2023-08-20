import type { Request } from 'express';
import {
	AnyZodObject,
	z,
	ZodEffects,
	ZodDiscriminatedUnion,
	ZodDiscriminatedUnionOption,
} from 'zod';

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

export default zParser;
