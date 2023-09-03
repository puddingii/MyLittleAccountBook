/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { InferType } from 'yup';
import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { QUERY_KEY } from './index';
import { notFixedWriterSchema, fixedWriterSchema } from 'validation/spendingAndIncome';
import { deleteToken } from 'utils/auth';
import userState from 'recoil/user';

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
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useMutation(createColumnFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.postColumn}create`);
		},
		onError: error => {
			if (isExpiredToken(error)) {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
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
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useMutation(patchColumnFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.postColumn}patch`);
		},
		onError: error => {
			if (isExpiredToken(error)) {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
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
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useMutation(deleteColumnFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.deleteColumn}delete`);
		},
		onError: error => {
			if (isExpiredToken(error)) {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
		},
	});
};
