import axios from 'axios';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router';

import { QUERY_KEY } from './index';
import { deleteToken, isExpiredToken } from 'utils/auth';
import userState from 'recoil/user';

/**
 * @param {number} accountBookId
 */
const getCategoryFetcher = accountBookId => {
	const fetcher = () =>
		axios
			.get(`${QUERY_KEY.getCategory}?accountBookId=${accountBookId}`, { withCredentials: true })
			.then(({ data }) => data);

	return fetcher;
};

export const useGetCategoryQuery = accountBookId => {
	const fetcher = getCategoryFetcher(accountBookId);
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useQuery(QUERY_KEY.getCategory, fetcher, {
		retry: false,
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

const getFetcher = info => {
	const fetcher = () => axios.get(`${QUERY_KEY.get}?${info}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

export const useGetQuery = (info, { onSuccess }) => {
	const params = new URLSearchParams(info);
	const fetcher = getFetcher(params.toString());
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useQuery(QUERY_KEY.get, fetcher, {
		retry: false,
		onSuccess: response => {
			onSuccess && onSuccess(response);
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

const getSummaryFetcher = info => {
	const fetcher = () =>
		axios.get(`${QUERY_KEY.getSummary}?${info}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

export const useGetSummaryQuery = (info, { onSuccess } = {}) => {
	const params = new URLSearchParams(info);
	const fetcher = getSummaryFetcher(params.toString());
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useQuery(QUERY_KEY.getSummary, fetcher, {
		retry: false,
		onSuccess: response => {
			onSuccess && onSuccess(response);
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

const getAccountBookInfoFetcher = info => {
	const fetcher = () =>
		axios.get(`${QUERY_KEY.getAccountBook}?${info}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

export const useGetAccountBookQuery = (info, { onSuccess, enabled } = { enabled: true }) => {
	const params = new URLSearchParams(info);
	const fetcher = getAccountBookInfoFetcher(params.toString());
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useQuery(`${QUERY_KEY.getAccountBook}get`, fetcher, {
		retry: false,
		enabled,
		onSuccess: response => {
			onSuccess && onSuccess(response);
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
