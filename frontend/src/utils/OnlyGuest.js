/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

import { useRefreshAccessTokenQuery } from 'queries/auth/authQuery';

const OnlyGuest = ({ children }) => {
	const navigate = useNavigate();
	useRefreshAccessTokenQuery({
		onSuccess: () => {
			navigate(-1);
		},
	});

	return children || null;
};

OnlyGuest.propTypes = {
	children: PropTypes.node,
};

export default OnlyGuest;
