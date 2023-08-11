import axios from 'axios';
import { useQuery } from 'react-query';
import { useSetRecoilState } from 'recoil';
import jwtDecode from 'jwt-decode';

import { QUERY_KEY } from './index';
import userState from 'recoil/user';
import { deleteToken, isExpiredToken, setToken } from 'utils/auth';
import { useNavigate } from 'react-router';

const refreshAccessTokenFetcher = () =>
	axios.get(QUERY_KEY.refresh, { withCredentials: true }).then(({ data }) => data);

export const useRefreshAccessTokenQuery = () => {
	const setUserInfo = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useQuery(QUERY_KEY.refresh, refreshAccessTokenFetcher, {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 55 * 60 * 1000,
		retry: false,
		onError: error => {
			if (isExpiredToken(error)) {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserInfo(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
		},
		onSuccess: response => {
			const { data } = response;
			const newAccessToken = data.accessToken;
			const decodedData = jwtDecode(newAccessToken);
			if (newAccessToken && decodedData) {
				setToken({ accessToken: newAccessToken });
				setUserInfo(beforeInfo => ({ ...beforeInfo, ...decodedData }));
			} else {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserInfo(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
		},
	});
};
