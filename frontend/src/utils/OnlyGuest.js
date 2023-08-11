import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { getCookie } from './cookie';
import { useEffect } from 'react';

const OnlyGuest = ({ children }) => {
	const navigate = useNavigate();

	useEffect(() => {
		const token = getCookie('token');

		if (token) {
			navigate('/dashboard/default');
		}
	}, []);

	return children || null;
};

OnlyGuest.propTypes = {
	children: PropTypes.node,
};

export default OnlyGuest;
