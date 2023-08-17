import MinimalLayout from 'layout/MinimalLayout';
import GuestGuard from 'utils/GuestGuard';

// render - new group

// ==============================|| MAIN ROUTING ||============================== //

const GuestGuardMinimalRoutes = {
	path: '/',
	element: (
		<GuestGuard>
			<MinimalLayout />
		</GuestGuard>
	),
	children: [],
};

export default GuestGuardMinimalRoutes;
