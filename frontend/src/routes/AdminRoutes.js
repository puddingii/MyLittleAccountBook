import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import SuperAdministratorGuard from 'utils/SuperAdministratorGuard';

const ManageNotice = Loadable(lazy(() => import('pages/manageNotice')));

const manageNoticePath = process.env.REACT_APP_MANAGE_NOTICE;
const MANAGE_NOTICE = manageNoticePath && {
	path: manageNoticePath,
	element: <ManageNotice />,
};

const AdminRoutes = {
	path: '/',
	element: (
		<SuperAdministratorGuard>
			<MinimalLayout />
		</SuperAdministratorGuard>
	),
	children: [MANAGE_NOTICE],
};

export default AdminRoutes;
