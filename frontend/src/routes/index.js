import { useRoutes } from 'react-router-dom';

// project import
import AuthRoutes from './AuthRoutes';
import AdminRoutes from './AdminRoutes';
import GuestGuardRoutes from './GuestGuardRoutes';
import NotFound from 'pages/not-found';
import SocialCallback from 'pages/authentication/SoicalCallback';
import Home from 'pages/home';
import VerificationEmail from 'pages/authentication/VerificationEmail';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
	return useRoutes([
		{
			path: '/',
			element: <Home />,
		},
		GuestGuardRoutes,
		AdminRoutes,
		AuthRoutes,
		{
			path: '/',
			children: [{ path: 'auth/social', element: <SocialCallback /> }],
		},
		{
			path: '/',
			children: [{ path: 'auth/email', element: <VerificationEmail /> }],
		},
		{
			path: '*',
			element: <NotFound />,
		},
	]);
}
