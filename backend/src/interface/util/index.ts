import { convertErrorToCustomError } from '@/util/error';
import { CustomError } from '@/util/error/class';

export type TErrorUtil = {
	convertErrorToCustomError: typeof convertErrorToCustomError;
	CustomError: typeof CustomError;
};
