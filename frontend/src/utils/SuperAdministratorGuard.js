import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router';

import { useRefreshAccessTokenQuery, useValidateSuperAdminQuery } from 'queries/auth/authQuery';
import { useEffect, useState } from 'react';

const SuperAdministratorGuard = ({ children }) => {
	const navigate = useNavigate();
	const params = useParams();
	const { id: accountBookId } = params;
	const [validInfo, setValidInfo] = useState({ refreshValid: false, superAdminValid: false });

	const { isSuccess: isSuccessToken } = useRefreshAccessTokenQuery({
		onError: () => {
			setValidInfo(beforeInfo => ({ ...beforeInfo, refreshValid: false }));
			navigate('/login');
		},
		onSuccess: () => {
			setValidInfo(beforeInfo => ({ ...beforeInfo, refreshValid: true }));
		},
	});

	const { refetch: validateRefetch, isSuccess: isSuccessValidate } = useValidateSuperAdminQuery(
		{},
		{
			onError: () => {
				setValidInfo(beforeInfo => ({ ...beforeInfo, superAdminValid: false }));
				navigate('/');
			},
			onSuccess: response => {
				const isValid = !!response?.data?.isValid;
				setValidInfo(beforeInfo => ({ ...beforeInfo, superAdminValid: isValid }));
				if (isValid === false) {
					navigate('/');
				}
			},
		},
	);

	const isSomeNotValid = Object.keys(validInfo).some(isValid => isValid === false);
	const isValid = !isSomeNotValid && isSuccessValidate && isSuccessToken;

	useEffect(() => {
		setValidInfo(beforeInfo => ({ ...beforeInfo, superAdminValid: false }));
		validateRefetch();

		return () => {
			setValidInfo(() => ({ refreshValid: false, superAdminValid: false }));
		};
	}, [validateRefetch, accountBookId]);

	return isValid ? children || null : <></>;
};

SuperAdministratorGuard.propTypes = {
	children: PropTypes.node,
};

export default SuperAdministratorGuard;
