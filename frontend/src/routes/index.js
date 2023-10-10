import { useRoutes } from 'react-router-dom';

// project import
import OnlyGuestMinimalRoutes from './OnlyGuestMinimalRoutes';
import GuestGuardRoutes from './GuestGuardRoutes';
import NotFound from 'pages/not-found';
import SocialCallback from 'pages/authentication/SoicalCallback';
import Home from 'pages/home';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
	return useRoutes([
		{
			path: '/',
			element: <Home />,
		},
		GuestGuardRoutes,
		OnlyGuestMinimalRoutes,
		{
			path: '/',
			children: [{ path: 'auth/social', element: <SocialCallback /> }],
		},
		{
			path: '*',
			element: <NotFound />,
		},
	]);
}
