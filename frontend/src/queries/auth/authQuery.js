import axios from 'axios';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import jwtDecode from 'jwt-decode';

import { QUERY_KEY } from './index';
import userState from 'recoil/user';
import { deleteToken, isExpiredToken, setToken } from 'utils/auth';
import { useNavigate } from 'react-router';

const refreshAccessTokenFetcher = () => axios.get(QUERY_KEY.token, { withCredentials: true }).then(({ data }) => data);

export const useRefreshAccessTokenQuery = () => {
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

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
				navigate('/login');
			}
		},
		onSuccess: response => {
			const { data } = response;
			const newAccessToken = data.accessToken;
			const decodedData = jwtDecode(newAccessToken);
			if (newAccessToken && decodedData) {
				setToken({ accessToken: newAccessToken });
				setUserState(beforeInfo => ({ ...beforeInfo, ...decodedData }));
			} else {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
		},
	});
};

/**
 * @param {'google' | 'naver'} type
 */
const socialLoginFetcher = (type, query) => {
	const fetcher = () =>
		axios.get(`${QUERY_KEY.socialLogin}/${type}${query}`, { withCredentials: true }).then(({ data }) => data);
	return fetcher;
};

export const useSocialLoginQuery = (type, params) => {
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();
	const fetcher = socialLoginFetcher(type, params);

	return useQuery(`${QUERY_KEY.socialLogin}/${type}`, fetcher, {
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		retry: false,
		onSuccess: response => {
			const { data, status } = response;
			if (status === 'success') {
				setToken({ accessToken: data.accessToken, refreshToken: data.refreshToken });
				const decodedData = jwtDecode(data.accessToken);
				setUserState(oldState => ({
					...oldState,
					email: decodedData.email,
					nickname: decodedData.nickname,
					isLogin: true,
				}));
				navigate('/dashboard/default');
			} else {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
		},
		onError: () => {
			deleteToken('Authorization');
			deleteToken('refresh');
			setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
			navigate('/login');
		},
	});
};
