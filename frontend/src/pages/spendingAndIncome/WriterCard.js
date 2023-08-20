import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

const WriterCard = ({ children, ...other }) => (
	<MainCard sx={{ mt: 2 }} content={false} {...other}>
		<Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
	</MainCard>
);

WriterCard.propTypes = {
	children: PropTypes.node,
};

export default WriterCard;
