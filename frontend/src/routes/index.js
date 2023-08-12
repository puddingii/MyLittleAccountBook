import { useRoutes } from 'react-router-dom';

// project import
import GuestRoutes from './GuestRoutes';
import MainRoutes from './MainRoutes';
import MinimalMainRoutes from './MinimalMainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
	return useRoutes([MainRoutes, MinimalMainRoutes, GuestRoutes]);
}
