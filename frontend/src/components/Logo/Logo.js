import logo from 'assets/images/icons/logo.png';
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = imgStyle => {
	return (
		<>
			<img src={logo} alt="mlaLogo" width="40" {...imgStyle} />
		</>
	);
};

export default Logo;
