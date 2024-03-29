import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import OnlyGuest from 'utils/OnlyGuest';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
	path: '/',
	element: (
		<OnlyGuest>
			<MinimalLayout />
		</OnlyGuest>
	),
	children: [
		{
			path: 'login',
			element: <AuthLogin />,
		},
		{
			path: 'register',
			element: <AuthRegister />,
		},
	],
};

export default LoginRoutes;
