import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import axios from 'axios';

import { useRefreshAccessTokenQuery } from 'queries/auth/authQuery';
import { getCookie } from './cookie';

const OnlyGuest = ({ children }) => {
	const navigate = useNavigate();
	const { isError, isFetched } = useRefreshAccessTokenQuery();

	useEffect(() => {
		const token = getCookie('token');
		const access = axios.defaults.headers.common.Authorization;

		if (token && access && isFetched && !isError) {
			navigate(-1);
		}
	}, []);

	return children || null;
};

OnlyGuest.propTypes = {
	children: PropTypes.node,
};

export default OnlyGuest;
