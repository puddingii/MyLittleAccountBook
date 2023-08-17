import MainLayout from 'layout/MainLayout';
import OnlyGuest from 'utils/OnlyGuest';

// render - dashboard

// ==============================|| MAIN ROUTING ||============================== //

const OnlyGuestRoutes = {
	path: '/',
	element: (
		<OnlyGuest>
			<MainLayout />
		</OnlyGuest>
	),
	children: [],
};

export default OnlyGuestRoutes;
