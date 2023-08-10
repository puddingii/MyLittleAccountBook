import PropTypes from 'prop-types';
import { useRefreshAccessTokenQuery } from 'queries/auth/authQuery';

const GuardedRoute = ({ children }) => {
	const { isError, isFetched } = useRefreshAccessTokenQuery();

	return isFetched && !isError && (children || null);
};

GuardedRoute.propTypes = {
	children: PropTypes.node,
};

export default GuardedRoute;
