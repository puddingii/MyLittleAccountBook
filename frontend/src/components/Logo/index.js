import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';
import { useRecoilState } from 'recoil';

// project import
import Logo from './Logo';
import config from 'config';
import menuState from 'recoil/menu';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx, to }) => {
	const [{ defaultId }, setMenuState] = useRecoilState(menuState);

	return (
		<ButtonBase
			disableRipple
			component={Link}
			onClick={() =>
				setMenuState(beforeState => ({ ...beforeState, openItem: [defaultId] }))
			}
			to={!to ? config.defaultPath : to}
			sx={sx}
		>
			<Logo />
		</ButtonBase>
	);
};

LogoSection.propTypes = {
	sx: PropTypes.object,
	to: PropTypes.string,
};

export default LogoSection;
