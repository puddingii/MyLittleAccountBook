import axios from 'axios';
import { useQuery } from 'react-query';

import { QUERY_KEY } from '.';

const getNoticeFetcher = info => {
	const fetcher = () => axios.get(`${QUERY_KEY.getNotice}?${info}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

/**
 * @param {{ id: string; }} info
 */
export const useGetNoticeQuery = (info, { onSuccess, onError, enabled } = {}) => {
	const params = new URLSearchParams(info);
	const fetcher = getNoticeFetcher(params.toString());

	return useQuery(QUERY_KEY.getNotice, fetcher, {
		retry: false,
		enabled,
		onSuccess: response => {
			onSuccess && onSuccess(response);
		},
		onError: error => {
			onError && onError(error);
		},
	});
};

const getNoticeListFetcher = info => {
	const fetcher = () =>
		axios.get(`${QUERY_KEY.getNoticeList}?${info}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

/**
 * @param {{ page: number; limit: number; }} info
 */
export const useGetNoticeListQuery = (info, { onSuccess, onError, enabled } = {}) => {
	const params = new URLSearchParams(info);
	const fetcher = getNoticeListFetcher(params.toString());

	return useQuery(QUERY_KEY.getNotice, fetcher, {
		retry: false,
		enabled,
		onSuccess: response => {
			onSuccess && onSuccess(response);
		},
		onError: error => {
			onError && onError(error);
		},
	});
};
