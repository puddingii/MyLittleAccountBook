import type { Request } from 'express';
import { AnyZodObject, z } from 'zod';

const zParser = async <T extends AnyZodObject>(
	schema: T,
	req: Request,
): Promise<z.infer<T>> => {
	const parsedRequest = await schema.parseAsync(req);
	return parsedRequest;
};

export default zParser;
