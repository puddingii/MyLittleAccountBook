import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const NotFound = Loadable(lazy(() => import('pages/not-found')));

// ==============================|| AUTH ROUTING ||============================== //

const MinimalRoutes = {
	path: '/',
	element: <MinimalLayout />,
	children: [
		{
			path: '*',
			element: <NotFound />,
		},
	],
};

export default MinimalRoutes;
