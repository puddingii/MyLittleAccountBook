// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useParams } from 'react-router';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
	const { id } = useParams();
	menuItem.items.forEach(item => {
		item.children.forEach(childInfo => {
			if (childInfo.url) {
				childInfo.url = childInfo.url.replace(':id', id);
			}
		});
	});
	const navGroups = menuItem.items.map(item => {
		switch (item.type) {
			case 'group':
				return <NavGroup key={item.id} item={item} />;
			default:
				return (
					<Typography key={item.id} variant="h6" color="error" align="center">
						Fix - Navigation Group
					</Typography>
				);
		}
	});

	return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
