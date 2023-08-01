import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import jwt_decode from 'jwt-decode';

import { QUERY_KEY } from './index';
import { userState } from 'recoil/user';

const loginFetcher = userInfo =>
	axios.post(QUERY_KEY.login, userInfo, {
		withCredentials: true,
	});

export const useUserLoginMutation = () => {
	const queryClient = useQueryClient();
	const setUserState = useSetRecoilState(userState);

	return useMutation(loginFetcher, {
		onSuccess: ({ data }) => {
			if (data?.token) {
				setToken(data?.token);
				const decodedData = jwt_decode(data.token);
				setUserState(oldState => ({
					...oldState,
					nickname: decodedData?.nickname,
					isLogin: true,
				}));
			}
			queryClient.invalidateQueries(QUERY_KEY.login);
		},
	});
};

const joinFetcher = userInfo =>
	axios.post(QUERY_KEY.join, userInfo, {
		withCredentials: true,
	});

export const useJoinMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(joinFetcher, {
		onSuccess: () => {
			window.location.href = '/login';
			queryClient.invalidateQueries(QUERY_KEY.join);
		},
	});
};
