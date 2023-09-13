import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { QUERY_KEY } from '.';
import { deleteToken, isExpiredToken } from 'utils/auth';
import userState from 'recoil/user';

const getUser = info => {
	const fetcher = () => axios.get(`${QUERY_KEY.get}?${info}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

/**
 * @param {{ email: string; }} info
 */
export const useGetUserQuery = (info, { onSuccess, onError, enabled } = {}) => {
	const params = new URLSearchParams(info);
	const fetcher = getUser(params.toString());
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useQuery(QUERY_KEY.get, fetcher, {
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
			onError && onError(error);
		},
	});
};
