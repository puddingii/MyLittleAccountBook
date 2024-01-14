import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';
import jwtDecode from 'jwt-decode';

import { QUERY_KEY } from './index';
import userState from 'recoil/user';
import { deleteToken, setToken } from 'utils/auth';

/**
 * @param {{ email: string; password: string; }} userInfo
 */
const emailLoginFetcher = userInfo =>
	axios
		.post(QUERY_KEY.emailLogin, userInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useEmailLoginMutation = () => {
	const queryClient = useQueryClient();
	const setUserState = useSetRecoilState(userState);

	return useMutation(emailLoginFetcher, {
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
				window.location.href = `/group/${data.accountBookId}/summary`;
			}
			queryClient.invalidateQueries(QUERY_KEY.login);
		},
	});
};

const socialLoginFetcher = socialInfo =>
	axios
		.post(`${QUERY_KEY.socialLogin}/${socialInfo.type}`, socialInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useSocialLoginMutation = type => {
	const queryClient = useQueryClient();
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useMutation(socialLoginFetcher, {
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
				window.location.href = `/group/${data.accountBookId}/summary`;
			} else {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
			queryClient.invalidateQueries(`${QUERY_KEY.socialLogin}/${type}`);
		},
		onError: () => {
			deleteToken('Authorization');
			deleteToken('refresh');
			setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
			navigate('/login');
		},
	});
};

/**
 * @param {'Google' | 'Naver'} type
 */
const getSocialLocationFetcher = type =>
	axios.get(`${QUERY_KEY.socialLogin}?type=${type}`, { withCredentials: true }).then(({ data }) => data);

export const useGetSocialLocationMutate = () => {
	const queryClient = useQueryClient();

	return useMutation(getSocialLocationFetcher, {
		onSuccess: response => {
			const { data, status } = response;
			if (status === 'success') {
				window.location.href = data.location;
			}
			queryClient.invalidateQueries(QUERY_KEY.socialLogin);
		},
	});
};

/**
 * @param {{ email: string; password: string; nickname: string; }} userInfo
 */
const joinFetcher = userInfo =>
	axios
		.post(QUERY_KEY.join, userInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useJoinMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation(joinFetcher, {
		onSuccess: response => {
			const { status } = response;
			if (status === 'success') {
				navigate('/login');
				queryClient.invalidateQueries(QUERY_KEY.join);
			}
		},
	});
};

const logoutFetcher = () =>
	axios
		.delete(QUERY_KEY.token, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useLogoutMutation = () => {
	const queryClient = useQueryClient();
	const setUserInfo = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useMutation(logoutFetcher, {
		onSuccess: () => {
			deleteToken('Authorization');
			deleteToken('refresh');
			setUserInfo(() => ({ email: '', isLogin: false, nickname: '' }));
			navigate('/login');
			queryClient.invalidateQueries(QUERY_KEY.token);
		},
	});
};

/**
 * @param {{ emailState: string; userEmail: string; }} info
 */
const verifyEmailFetcher = info =>
	axios
		.patch(QUERY_KEY.verifyEmail, info, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useVerifyEmailMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(verifyEmailFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(QUERY_KEY.login);
		},
	});
};

/**
 * @param {} info
 */
const resendEmailVerificationFetcher = info =>
	axios
		.post(QUERY_KEY.resendEmail, info, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useEmailVerficationMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(resendEmailVerificationFetcher, {
		onSuccess: () => {
			queryClient.invalidateQueries(QUERY_KEY.login);
		},
	});
};
