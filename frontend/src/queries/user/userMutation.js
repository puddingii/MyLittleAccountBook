import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import jwtDecode from 'jwt-decode';

import { QUERY_KEY } from '.';
import userState from 'recoil/user';
import { setToken } from 'utils/auth';

const updateUserFetcher = userInfo =>
	axios
		.patch(QUERY_KEY.update, userInfo, {
			withCredentials: true,
		})
		.then(({ data }) => data);

export const useUpdateUserMutation = () => {
	const queryClient = useQueryClient();
	const setUserState = useSetRecoilState(userState);

	return useMutation(updateUserFetcher, {
		onSuccess: response => {
			const { data, status } = response;
			if (status === 'success') {
				console.log('?');
				setToken({ accessToken: data.accessToken, refreshToken: data.refreshToken });
				const decodedData = jwtDecode(data.accessToken);
				setUserState(oldState => ({
					...oldState,
					...decodedData,
				}));
			}
			queryClient.invalidateQueries(`${QUERY_KEY.update}update`);
		},
	});
};
