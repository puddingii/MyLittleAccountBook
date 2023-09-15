import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { QUERY_KEY } from '.';

/**
 * @param {{ email: string; type: 'observer' | 'writer' | 'manager'; accountBookId: number;}} userInfo
 */
const updateTypeFetcher = userInfo =>
	axios
		.patch(QUERY_KEY.update, userInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useUpdateTypeMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(updateTypeFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.update}update`);
		},
	});
};

/**
 * @param {{email: string; type: 'observer' | 'writer' | 'manager'; accountBookId: number;}} userInfo
 */
const addGroupUserFetcher = userInfo =>
	axios
		.post(QUERY_KEY.add, userInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useAddGroupUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(addGroupUserFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.add}add`);
		},
	});
};

/**
 * @param {{id: number; accountBookId: number;}} info
 */
const deleteGroupUserFetcher = async info => {
	const params = new URLSearchParams(info).toString();

	const { data } = await axios.delete(`${QUERY_KEY.delete}?${params}`, {
		withCredentials: true,
	});

	return data;
};

export const useDeleteGroupUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(deleteGroupUserFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.add}add`);
		},
	});
};
