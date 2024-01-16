import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { QUERY_KEY } from '.';

/**
 * @param {{ id: number; title: string; content: string; isUpdateContent: boolean; }} noticeInfo
 */
const updateNoticeFetcher = noticeInfo =>
	axios
		.patch(QUERY_KEY.updateNotice, noticeInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useUpdateNoticeMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(updateNoticeFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.updateNotice}update`);
		},
	});
};

/**
 * @param {{ title: string; content: string; isUpdateContent: boolean; }} noticeInfo
 */
const createNoticeFetcher = noticeInfo =>
	axios
		.post(QUERY_KEY.createNotice, noticeInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useCreateNoticeMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(createNoticeFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.createNotice}create`);
		},
	});
};

/**
 * @param {{ id: number; }} info
 */
const deleteNoticeFetcher = async info => {
	const params = new URLSearchParams(info).toString();

	const { data } = await axios.delete(`${QUERY_KEY.deleteNotice}?${params}`, {
		withCredentials: true,
	});

	return data;
};

export const useDeleteNoticeMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(deleteNoticeFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(`${QUERY_KEY.deleteNotice}delete`);
		},
	});
};
