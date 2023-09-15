import { Grid, Typography, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

import EditAccountBook from './EditAccountBook';

const ManageAccountBook = () => {
	const [snackbarInfo, setSnackbarInfo] = useState({ isOpen: false, message: '', severity: 'info' });
	const [accountBookInfo, setAccountBookInfo] = useState({});

	const handleCloseSnackbar = () => {
		setSnackbarInfo(beforeInfo => ({ ...beforeInfo, isOpen: false }));
	};

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={snackbarInfo.isOpen}
				onClose={handleCloseSnackbar}
				autoHideDuration={5000}
				key={'manageAccountBookSnackbar'}
			>
				<Alert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} sx={{ width: '100%' }}>
					{snackbarInfo.message}
				</Alert>
			</Snackbar>
			<Grid item xs={12}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">가계부 정보 수정하기</Typography>
					</Grid>
					<Grid item />
				</Grid>
				<EditAccountBook setAccountBookInfo={setAccountBookInfo} setSnackbarInfo={setSnackbarInfo} />
			</Grid>
		</Grid>
	);
};

export default ManageAccountBook;
