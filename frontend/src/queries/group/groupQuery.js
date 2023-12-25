import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { QUERY_KEY } from '.';
import { deleteToken, isExpiredToken } from 'utils/auth';
import userState from 'recoil/user';

const getGroupUserList = info => {
	const fetcher = () =>
		axios.get(`${QUERY_KEY.getGroupUserList}?${info}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

/**
 * @param {{ accountBookId: string; }} info
 */
export const useGetGroupUserListQuery = (info, { onSuccess, onError, enabled } = {}) => {
	const params = new URLSearchParams(info);
	const fetcher = getGroupUserList(params.toString());
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useQuery(QUERY_KEY.getGroupUserList, fetcher, {
		retry: false,
		enabled,
		onSuccess: response => {
			onSuccess && onSuccess(response);
		},
		onError: error => {
			onError && onError(error);
			if (isExpiredToken(error)) {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
		},
	});
};

const getGroupAccountBookList = () => {
	const fetcher = () =>
		axios.get(`${QUERY_KEY.getGroupAccountBookList}`, { withCredentials: true }).then(({ data }) => data);

	return fetcher;
};

export const useGetGroupAccountBookListQuery = ({ onSuccess, onError, enabled } = {}) => {
	const fetcher = getGroupAccountBookList();
	const setUserState = useSetRecoilState(userState);
	const navigate = useNavigate();

	return useQuery(QUERY_KEY.getGroupAccountBookList, fetcher, {
		retry: false,
		enabled,
		onSuccess: response => {
			onSuccess && onSuccess(response);
		},
		onError: error => {
			onError && onError(error);
			if (isExpiredToken(error)) {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
				navigate('/login');
			}
		},
	});
};
