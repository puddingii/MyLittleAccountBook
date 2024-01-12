import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Box, Fade, Modal, Snackbar, Alert, Typography } from '@mui/material';

import NoticeList from './NoticeList';
import NoticeContent from './NoticeContent';
import { useGetNoticeListQuery } from 'queries/notice/noticeQuery';

const boxStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '75%',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
};

const PAGE_PER_LIMIT = 10;

const NoticeModal = ({ open, handleClose }) => {
	const pageState = useState(1);
	const page = pageState[0];
	const noticeState = useState(-1);
	const [snackbarInfo, setSnackbarInfo] = useState({ isOpen: false, message: '', severity: 'info' });

	const { data: response, refetch } = useGetNoticeListQuery({ page: pageState[0], limit: PAGE_PER_LIMIT });
	const list = response?.data?.list ?? [];
	const count = response?.data?.count || 1;
	const endOfPage = Math.floor(count / PAGE_PER_LIMIT) + (count % PAGE_PER_LIMIT !== 0);

	const handleCloseSnackbar = () => {
		setSnackbarInfo(beforeInfo => ({ ...beforeInfo, isOpen: false }));
	};

	useEffect(() => {
		refetch();
	}, [refetch, page]);

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
					<Typography sx={{ marginBottom: '10px' }} variant="h4">
						업데이트 및 공지사항
					</Typography>

					<NoticeList list={list} endOfPage={endOfPage} pageState={pageState} noticeState={noticeState} />
					<NoticeContent list={list} noticeState={noticeState} />
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

NoticeModal.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};

export default NoticeModal;
