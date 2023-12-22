import axios from 'axios';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import jwtDecode from 'jwt-decode';

import { QUERY_KEY } from './index';
import userState from 'recoil/user';
import { deleteToken, isExpiredToken, setToken } from 'utils/auth';

const refreshAccessTokenFetcher = () => axios.get(QUERY_KEY.token, { withCredentials: true }).then(({ data }) => data);

export const useRefreshAccessTokenQuery = ({ onSuccess, onError } = {}) => {
	const setUserState = useSetRecoilState(userState);

	return useQuery(QUERY_KEY.token, refreshAccessTokenFetcher, {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		refetchInterval: 55 * 60 * 1000,
		staleTime: 55 * 60 * 1000,
		retry: false,
		onError: error => {
			if (isExpiredToken(error)) {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
			}
			onError && onError(error);
		},
		onSuccess: response => {
			const { data } = response;
			const newAccessToken = data?.accessToken;
			const decodedData = jwtDecode(newAccessToken);
			if (newAccessToken && decodedData) {
				setToken({ accessToken: newAccessToken });
				setUserState(beforeInfo => ({ ...beforeInfo, ...decodedData }));
			} else {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				onError && onError(new Error('토큰 에러'));
			}
			onSuccess && onSuccess(decodedData);
		},
	});
};

const getValidateGroupUserFetcher = info => {
	const fetcher = () => axios.get(`${QUERY_KEY.validate}?${info}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

/** @param {{ accountBookId: number | string; }} info */
export const useValidateGroupUserQuery = (info, { onSuccess, onError }) => {
	const params = new URLSearchParams(info);
	const fetcher = getValidateGroupUserFetcher(params.toString());

	return useQuery(QUERY_KEY.validate, fetcher, {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		refetchInterval: 55 * 60 * 1000,
		staleTime: 55 * 60 * 1000,
		retry: false,
		onError: error => {
			onError && onError(error);
		},
		onSuccess: response => {
			onSuccess && onSuccess(response);
		},
	});
};
