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
		.post(QUERY_KEY.postColumnm, columnInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useCreateColumnMutation = () => {
	const queryClient = useQueryClient();
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useMutation(createColumnFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.postColumnm}create`);
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
		.patch(QUERY_KEY.patchColumnm, columnInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const usePatchColumnMutation = () => {
	const queryClient = useQueryClient();
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useMutation(patchColumnFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.postColumnm}patch`);
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
