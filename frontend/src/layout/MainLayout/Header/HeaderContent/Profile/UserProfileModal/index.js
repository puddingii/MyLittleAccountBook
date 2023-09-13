import { useState } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Box, Fade, Modal, Snackbar, Alert } from '@mui/material';
import CreateGroup from './CreateGroup';

const boxStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 800,
	bgcolor: 'background.paper',
	// border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const UserProfileModal = ({ open, handleClose }) => {
	const [snackbarInfo, setSnackbarInfo] = useState({ isOpen: false, message: '', severity: 'info' });

	const handleCloseSnackbar = () => {
		setSnackbarInfo(beforeInfo => ({ ...beforeInfo, isOpen: false }));
	};

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}
		>
			<Fade in={open}>
				<Box sx={boxStyle}>
					<CreateGroup setSnackbarInfo={setSnackbarInfo} />
					<Snackbar
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
						open={snackbarInfo.isOpen}
						onClose={handleCloseSnackbar}
						autoHideDuration={5000}
						key={'snackbarBox'}
					>
						<Alert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} sx={{ width: '100%' }}>
							{snackbarInfo.message}
						</Alert>
					</Snackbar>
				</Box>
			</Fade>
		</Modal>
	);
};

UserProfileModal.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};

export default UserProfileModal;
