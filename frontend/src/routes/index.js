import { useRoutes } from 'react-router-dom';

// project import
import OnlyGuestMinimalRoutes from './OnlyGuestMinimalRoutes';
import OnlyGuestRoutes from './OnlyGuestRoutes';
import GuestGuardRoutes from './GuestGuardRoutes';
import GuestGuardMinimalRoutes from './GuestGuardMinimalRoutes';
import MinimalRoutes from './MinimalRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
	return useRoutes([GuestGuardRoutes, GuestGuardMinimalRoutes, OnlyGuestMinimalRoutes, OnlyGuestRoutes, MinimalRoutes]);
}

console.log(ThemeRoutes);
