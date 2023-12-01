/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from 'react-router-dom';

// project import
import { useSocialLoginMutation } from 'queries/auth/authMutation';
import { useEffect } from 'react';

const SocialCallback = () => {
	const loc = useLocation();
	const params = new URLSearchParams(loc.search.slice(1));
	const type = params.get('type');
	const paramInfo = {};
	for (const [key, value] of params.entries()) {
		paramInfo[key] = value;
	}
	const { mutate } = useSocialLoginMutation(type);

	useEffect(() => {
		mutate(paramInfo);
	}, []);
	return <></>;
};

export default SocialCallback;
