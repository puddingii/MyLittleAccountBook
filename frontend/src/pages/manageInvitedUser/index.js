import { Grid, Divider, Snackbar, Typography, Alert } from '@mui/material';
import { useParams } from 'react-router';
import { useState } from 'react';

import SortTable from './InvitedUserTable';
import InviteUserForm from './InviteUserForm';
import { useGetGroupListQuery } from 'queries/group/groupQuery';

const ManageInvitedUser = () => {
	const [snackbarInfo, setSnackbarInfo] = useState({ isOpen: false, message: '', severity: 'info' });
	const [invitedUserList, setInvitedUserList] = useState([]);
	const param = useParams();
	const accountBookId = parseInt(param?.id ?? -1, 10);

	useGetGroupListQuery(
		{ accountBookId },
		{
			onSuccess: response => {
				setInvitedUserList(response?.data ?? []);
			},
		},
	);

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
				key={'manageInvitedUserSnackbar'}
			>
				<Alert onClose={handleCloseSnackbar} severity={snackbarInfo.severity} sx={{ width: '100%' }}>
					{snackbarInfo.message}
				</Alert>
			</Snackbar>
			<Grid item xs={12}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">유저 초대하기</Typography>
					</Grid>
					<Grid item />
				</Grid>
				<InviteUserForm
					invitedUserList={invitedUserList}
					setInvitedUserList={setInvitedUserList}
					setSnackbarInfo={setSnackbarInfo}
					accountBookId={accountBookId}
				/>
			</Grid>
			<Divider style={{ marginTop: '20px' }} />
			<Grid item xs={12}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">초대된 유저 리스트</Typography>
					</Grid>
					<Grid item />
				</Grid>
				<SortTable rows={invitedUserList} setInvitedUserList={setInvitedUserList} accountBookId={accountBookId} />
			</Grid>
		</Grid>
	);
};

export default ManageInvitedUser;
