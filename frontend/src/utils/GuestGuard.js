import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router';

import { useRefreshAccessTokenQuery, useValidateGroupUserQuery } from 'queries/auth/authQuery';
import { useEffect, useState } from 'react';

const GuardedRoute = ({ children }) => {
	const navigate = useNavigate();
	const params = useParams();
	const { id: accountBookId } = params;
	const [validInfo, setValidInfo] = useState({ refreshValid: false, groupUserValid: false });

	const { isSuccess: isSuccessToken } = useRefreshAccessTokenQuery({
		onError: () => {
			setValidInfo(beforeInfo => ({ ...beforeInfo, refreshValid: false }));
			navigate('/login');
		},
		onSuccess: () => {
			setValidInfo(beforeInfo => ({ ...beforeInfo, refreshValid: true }));
		},
	});

	const { refetch: validateRefetch, isSuccess: isSuccessValidate } = useValidateGroupUserQuery(
		{ accountBookId },
		{
			onError: () => {
				setValidInfo(beforeInfo => ({ ...beforeInfo, groupUserValid: false }));
				navigate('/');
			},
			onSuccess: response => {
				const isValid = !!response?.data?.isValid;
				console.log('refetchValidate', isValid);
				setValidInfo(beforeInfo => ({ ...beforeInfo, groupUserValid: isValid }));
				if (isValid === false) {
					navigate('/');
				}
			},
		},
	);

	const isSomeNotValid = Object.keys(validInfo).some(isValid => isValid === false);
	const isValid = !isSomeNotValid && isSuccessValidate && isSuccessToken;

	useEffect(() => {
		setValidInfo(beforeInfo => ({ ...beforeInfo, groupUserValid: false }));
		validateRefetch();

		return () => {
			setValidInfo(() => ({ refreshValid: false, groupUserValid: false }));
		};
	}, [validateRefetch, accountBookId]);

	return isValid ? children || null : <></>;
};

GuardedRoute.propTypes = {
	children: PropTypes.node,
};

export default GuardedRoute;
