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
