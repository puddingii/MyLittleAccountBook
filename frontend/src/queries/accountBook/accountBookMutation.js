/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { InferType } from 'yup';

import { QUERY_KEY } from './index';
import { notFixedWriterSchema, fixedWriterSchema } from 'validation/spendingAndIncome';

/**
 * @param {InferType<typeof notFixedWriterSchema> | InferType<typeof fixedWriterSchema> } columnInfo
 */
const createColumnFetcher = columnInfo =>
	axios
		.post(QUERY_KEY.postColumn, columnInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useCreateColumnMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(createColumnFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.postColumn}create`);
		},
	});
};

/**
 * @param {Partial<InferType<typeof notFixedWriterSchema>> | Partial<InferType<typeof fixedWriterSchema>> } columnInfo
 */
const patchColumnFetcher = columnInfo =>
	axios
		.patch(QUERY_KEY.patchColumn, columnInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const usePatchColumnMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(patchColumnFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.postColumn}patch`);
		},
	});
};

/**
 * @param {{ writeType: 'nf' | 'f'; id: number; }} columnInfo
 */
const deleteColumnFetcher = columnInfo =>
	axios
		.delete(`${QUERY_KEY.deleteColumn}?${new URLSearchParams(columnInfo).toString()}`, { withCredentials: true })
		.then(({ data }) => data);

export const useDeleteColumnMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(deleteColumnFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.deleteColumn}delete`);
		},
	});
};

const createAccountBookFetcher = info =>
	axios
		.post(QUERY_KEY.postAccountBook, info, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useCreateAccountBookMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(createAccountBookFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.postAccountBook}create`);
		},
	});
};

/**
 * @param {{ accountBookId: number; title?: string; content?: string; }} info
 */
const updateAccountBookFetcher = info =>
	axios
		.patch(QUERY_KEY.updateAccountBook, info, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useUpdateAccountBookMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(updateAccountBookFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.updateAccountBook}update`);
		},
	});
};
