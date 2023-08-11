import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import jwtDecode from 'jwt-decode';

import { QUERY_KEY } from './index';
import userState from 'recoil/user';
import { setToken } from 'utils/auth';
import { useNavigate } from 'react-router';

/**
 * @param {{ email: string; password: string; }} userInfo
 */
const emailLoginFetcher = userInfo =>
	axios.post(QUERY_KEY.emailLogin, userInfo, {
		withCredentials: true,
	});

export const useEmailLoginMutation = () => {
	const queryClient = useQueryClient();
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useMutation(emailLoginFetcher, {
		onSuccess: ({ data: response }) => {
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
			}
			queryClient.invalidateQueries(QUERY_KEY.login);
		},
	});
};

/**
 * @param {'Google' | 'Naver'} type
 */
const socialLoginFetcher = type =>
	axios.post(QUERY_KEY.emailLogin, type, {
		withCredentials: true,
	});

export const useSocialLoginMutation = () => {
	const queryClient = useQueryClient();
	const setUserState = useSetRecoilState(userState);

	return useMutation(socialLoginFetcher, {
		onSuccess: ({ data }) => {
			if (data) {
				setToken({ accessToken: data.accessToken, refreshToken: data.refreshToken });
				const decodedData = jwtDecode(data.accessToken);
				setUserState(oldState => ({
					...oldState,
					email: decodedData.email,
					nickname: decodedData.nickname,
					isLogin: true,
				}));
			}
			queryClient.invalidateQueries(QUERY_KEY.login);
		},
	});
};

/**
 * @param {{ email: string; password: string; nickname: string; }} userInfo
 */
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
