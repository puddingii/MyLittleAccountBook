// material-ui
import { Box, useMediaQuery } from '@mui/material';

// project import
import GroupSelector from './GroupSelector';
import Profile from './Profile';
import MobileSection from './MobileSection';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
	const matchesMd = useMediaQuery(theme => theme.breakpoints.down('md'));
	const matchesXs = useMediaQuery(theme => theme.breakpoints.down('sm'));

	return (
		<>
			<GroupSelector matchesXs={matchesXs} />
			{matchesMd && <Box sx={{ width: '100%', ml: 1 }} />}

			{!matchesMd && <Profile />}
			{matchesMd && <MobileSection />}
		</>
	);
};

export default HeaderContent;
