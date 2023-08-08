import { ValidationError } from 'sequelize';
import { ZodError } from 'zod';

import { CustomError } from './class';
import { TContext } from './class/interface';

const checkIsCustomError = (error: unknown): error is CustomError => {
	return error instanceof CustomError;
};

export const convertErrorToCustomError = (
	error: unknown,
	options: { cause?: unknown; trace: string; code?: TContext } = { trace: 'unknown' },
) => {
	const { trace, cause, code } = options;

	if (checkIsCustomError(error)) {
		error.addTrace(options.trace);
		return error;
	}

	if (
		error instanceof ValidationError ||
		error instanceof Error ||
		error instanceof ZodError
	) {
		return new CustomError(error.message, {
			cause: cause ?? error.cause,
			traceList: [trace],
			code,
		});
	}

	if (typeof error === 'string') {
		return new CustomError(error, {
			traceList: [trace],
			code,
			cause,
		});
	}

	return new CustomError('Unknown Error', { traceList: [trace], code, cause });
};
