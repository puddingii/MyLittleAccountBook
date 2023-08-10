import { useRoutes } from 'react-router-dom';

// project import
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
	return useRoutes([MainRoutes, AuthRoutes]);
}
