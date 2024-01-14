import PropTypes from 'prop-types';

// material-ui
import { Box } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

const boxStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80%',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};

const Card = ({ children, ...other }) => (
	<MainCard style={boxStyle} {...other}>
		<Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
	</MainCard>
);

Card.propTypes = {
	children: PropTypes.node,
};

export default Card;
