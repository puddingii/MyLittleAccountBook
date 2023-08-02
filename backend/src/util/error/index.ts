import { ValidationError } from 'sequelize';
import { ZodError } from 'zod';

import { CustomError } from './class';
import { TContext } from './class/interface';

export const checkIsCustomError = (error: unknown): error is CustomError => {
	return error instanceof CustomError;
};

export const convertErrorToCustomError = (
	error: unknown,
	options: { cause?: unknown; trace: string; context?: TContext } = { trace: 'unknown' },
) => {
	const { trace, cause, context } = options;

	if (
		error instanceof ValidationError ||
		error instanceof Error ||
		error instanceof ZodError
	) {
		return new CustomError(error.message, {
			cause: cause ?? error.cause,
			traceList: [trace],
			context,
		});
	}

	if (typeof error === 'string') {
		return new CustomError(error, {
			traceList: [trace],
			context,
			cause,
		});
	}

	return new CustomError('Unknown Error', { traceList: [trace], context, cause });
};
