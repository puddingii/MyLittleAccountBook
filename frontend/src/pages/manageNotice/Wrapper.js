import PropTypes from 'prop-types';

// material-ui
import { Box, Grid } from '@mui/material';

// project import
import Card from './Card';
import Logo from 'components/Logo';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';

const Wrapper = ({ children }) => (
	<Box sx={{ minHeight: '100vh' }}>
		<AuthBackground />
		<Grid container direction="column" justifyContent="flex-end">
			<Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
				<Logo />
			</Grid>
			<Grid item xs={12}>
				<Grid
					item
					xs={12}
					container
					justifyContent="center"
					alignItems="center"
					sx={{ minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
				>
					<Grid item>
						<Card>{children}</Card>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	</Box>
);

Wrapper.propTypes = {
	children: PropTypes.node,
};

export default Wrapper;
