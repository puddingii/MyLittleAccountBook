import { useLocation } from 'react-router-dom';

// project import
import { useSocialLoginQuery } from 'queries/auth/authQuery';

const SocialCallback = () => {
	const loc = useLocation();
	const params = new URLSearchParams(loc.search.slice(1));
	const type = params.get('type');
	useSocialLoginQuery(type, loc.search);
	return <></>;
};

export default SocialCallback;
