import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { getCookie } from './cookie';
import { useEffect } from 'react';
import axios from 'axios';

const OnlyGuest = ({ children }) => {
	const navigate = useNavigate();

	useEffect(() => {
		const token = getCookie('token');
		const access = axios.defaults.headers.common.Authorization;

		if (token && access) {
			navigate(-1);
		}
	}, []);

	return children || null;
};

OnlyGuest.propTypes = {
	children: PropTypes.node,
};

export default OnlyGuest;
