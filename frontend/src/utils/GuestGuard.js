import PropTypes from 'prop-types';
import { useRefreshAccessTokenQuery } from 'queries/auth/authQuery';
import { useNavigate } from 'react-router';

const GuardedRoute = ({ children }) => {
	const navigate = useNavigate();
	const { isError, isFetched } = useRefreshAccessTokenQuery();

	if (isFetched && isError) {
		navigate('/login');
	}

	return isFetched && !isError ? children || null : <></>;
};

GuardedRoute.propTypes = {
	children: PropTypes.node,
};

export default GuardedRoute;
