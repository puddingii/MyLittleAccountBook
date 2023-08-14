import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from 'menu-items';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// types
import menuState from 'recoil/menu';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
	const theme = useTheme();
	const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
	const { id } = useParams();
	navigation.items.forEach(item => {
		item.children.forEach(childInfo => {
			if (childInfo.url) {
				childInfo.url = childInfo.url.replace(':id', id);
			}
		});
	});

	const [{ drawerOpen }, setMenuState] = useRecoilState(menuState);

	// drawer toggler
	const [open, setOpen] = useState(drawerOpen);
	const handleDrawerToggle = () => {
		setOpen(!open);
		setMenuState(beforeInfo => ({ ...beforeInfo, drawerOpen: !open }));
	};

	// set media wise responsive drawer
	useEffect(() => {
		setOpen(!matchDownLG);
		setMenuState(beforeInfo => ({ ...beforeInfo, drawerOpen: !matchDownLG }));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matchDownLG]);

	useEffect(() => {
		if (open !== drawerOpen) setOpen(drawerOpen);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [drawerOpen]);

	return (
		<Box sx={{ display: 'flex', width: '100%' }}>
			<Header open={open} handleDrawerToggle={handleDrawerToggle} />
			<Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
			<Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
				<Toolbar />
				<Breadcrumbs navigation={navigation} title />
				<Outlet />
			</Box>
		</Box>
	);
};

export default MainLayout;
