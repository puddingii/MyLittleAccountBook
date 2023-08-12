import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import GuestGuard from 'utils/GuestGuard';

// render - new group

// ==============================|| MAIN ROUTING ||============================== //

const MinimalMainRoutes = {
	path: '/',
	element: (
		<GuestGuard>
			<MinimalLayout />
		</GuestGuard>
	),
	children: [],
};

export default MinimalMainRoutes;
