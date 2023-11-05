import { ValidationError } from 'sequelize';
import { ZodError } from 'zod';

import { CustomError } from './class';
import { TContext } from './class/interface';

const checkIsCustomError = (error: unknown): error is CustomError => {
	return error instanceof CustomError;
};

export const convertErrorToCustomError = (
	error: unknown,
	options: Partial<{ cause: unknown; trace: string; context: TContext; code: number }>,
) => {
	const { cause, code, context, trace } = options;
	const traceList = options.trace ? [options.trace] : [];

	if (checkIsCustomError(error) && trace) {
		error.addTrace(trace);
		return error;
	}

	if (checkIsCustomError(error)) {
		return error;
	}

	if (error instanceof ZodError) {
		const message = error.issues.reduce((acc, issue) => `${acc} ${issue.message}`, '');
		return new CustomError(message, {
			cause: cause ?? error,
			traceList,
			context,
			code: code ?? 400,
		});
	}

	if (error instanceof ValidationError || error instanceof Error) {
		return new CustomError(error.message, {
			cause: cause ?? error.cause,
			traceList,
			context,
			code: code ?? 400,
		});
	}

	if (typeof error === 'string') {
		return new CustomError(error, {
			traceList,
			context,
			code: code ?? 400,
			cause,
		});
	}

	return new CustomError('Unknown Error', {
		traceList,
		code: code ?? 400,
		cause,
		context,
	});
};

export const filterPromiseSettledResultList = <T>(
	resultList: Array<PromiseSettledResult<T>>,
) => {
	return resultList.reduce(
		(acc, result) => {
			if (result.status === 'fulfilled') {
				acc.fulfilledList.push(result);
			} else {
				acc.rejectedList.push(result as PromiseRejectedResult);
			}

			return acc;
		},
		{ fulfilledList: [], rejectedList: [] } as {
			fulfilledList: Array<PromiseFulfilledResult<T>>;
			rejectedList: Array<PromiseRejectedResult>;
		},
	);
};
