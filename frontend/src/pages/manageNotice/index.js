import { Snackbar, Alert, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import { useGetNoticeListQuery } from 'queries/notice/noticeQuery';

import Wrapper from './Wrapper';
import NoticeList from 'layout/MainLayout/Header/HeaderContent/Profile/NoticeModal/NoticeList';
import NoticeContent from 'layout/MainLayout/Header/HeaderContent/Profile/NoticeModal/NoticeContent';
import ManageForm from './ManageForm';

const PAGE_PER_LIMIT = 10;

const ManageNotice = () => {
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
		<Wrapper>
			<Grid container>
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
				<Grid sx={{ borderRight: 'solid 1px' }} item xs={8} lg={8}>
					<Typography sx={{ marginBottom: '10px' }} variant="h4">
						업데이트 및 공지사항
					</Typography>
					<NoticeList list={list} endOfPage={endOfPage} pageState={pageState} noticeState={noticeState} />
					<NoticeContent list={list} noticeState={noticeState} />
				</Grid>
				<Grid sx={{ paddingLeft: '20px' }} item xs={4} lg={4}>
					<Typography sx={{ marginBottom: '10px' }} variant="h4">
						Notice manager (선택된 공지Id: {noticeState[0] === -1 ? 'X' : list[noticeState[0]].id})
					</Typography>
					<ManageForm noticeState={noticeState} />
				</Grid>
			</Grid>
		</Wrapper>
	);
};

export default ManageNotice;
