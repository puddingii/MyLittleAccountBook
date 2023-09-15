import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import GuestGuard from 'utils/GuestGuard';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const ThisMonthSummary = Loadable(lazy(() => import('pages/summary')));
const SpendingAndIncomeManageBoard = Loadable(lazy(() => import('pages/spendingAndIncome')));
const ManageInvitedUser = Loadable(lazy(() => import('pages/manageInvitedUser')));
const ManageAccountBook = Loadable(lazy(() => import('pages/manageAccountBook')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const GuestGuardRoutes = {
	path: '/',
	element: (
		<GuestGuard>
			<MainLayout />
		</GuestGuard>
	),
	children: [
		{
			path: 'group/:id',
			element: <DashboardDefault />,
		},
		{
			path: 'group/:id/color',
			element: <Color />,
		},
		{
			path: 'group/:id/dashboard',
			children: [
				{
					path: 'default',
					element: <DashboardDefault />,
				},
			],
		},
		{
			path: 'group/:id/summary',
			element: <ThisMonthSummary />,
		},
		{
			path: 'group/:id/spending-income',
			element: <SpendingAndIncomeManageBoard />,
		},
		{
			path: 'group/:id/manage-user',
			element: <ManageInvitedUser />,
		},
		{
			path: 'group/:id/manage-accountbook',
			element: <ManageAccountBook />,
		},
		{
			path: 'group/:id/sample-page',
			element: <SamplePage />,
		},
		{
			path: 'group/:id/shadow',
			element: <Shadow />,
		},
		{
			path: 'group/:id/typography',
			element: <Typography />,
		},
		{
			path: 'group/:id/icons/ant',
			element: <AntIcons />,
		},
	],
};

export default GuestGuardRoutes;
