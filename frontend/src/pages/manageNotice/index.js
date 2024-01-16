import { Snackbar, Alert, Typography, Grid, Button, Stack, Box } from '@mui/material';
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
	const curManagingNoticeState = useState(null);
	const [curManagingNotice, setCurManagingNotice] = curManagingNoticeState;
	const [snackbarInfo, setSnackbarInfo] = useState({ isOpen: false, message: '', severity: 'info' });

	const { data: response, refetch } = useGetNoticeListQuery({ page: pageState[0], limit: PAGE_PER_LIMIT });
	const list = response?.data?.list ?? [];
	const count = response?.data?.count || 1;
	const endOfPage = Math.floor(count / PAGE_PER_LIMIT) + (count % PAGE_PER_LIMIT !== 0);

	const handleCloseSnackbar = () => {
		setSnackbarInfo(beforeInfo => ({ ...beforeInfo, isOpen: false }));
	};

	const handleManage = () => {
		const noticeNum = noticeState[0];
		if (noticeNum !== -1 && curManagingNotice) {
			setCurManagingNotice(null);
			return;
		}

		if (noticeNum !== -1) {
			setCurManagingNotice(list[noticeNum]);
			return;
		}
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
				<Grid sx={{ borderRight: 'solid 1px', paddingRight: '20px' }} item xs={8} lg={8}>
					<Stack direction="row" sx={{ paddingBottom: '10px' }}>
						<Typography sx={{ marginBottom: '10px' }} variant="h4">
							업데이트 및 공지사항
						</Typography>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button onClick={handleManage} variant="contained" color={curManagingNotice === null ? 'primary' : 'error'}>
							{curManagingNotice === null ? '관리하기 >' : '관리해제'}
						</Button>
					</Stack>
					<NoticeList list={list} endOfPage={endOfPage} pageState={pageState} noticeState={noticeState} />
					<NoticeContent list={list} noticeState={noticeState} />
				</Grid>
				<Grid sx={{ paddingLeft: '20px' }} item xs={4} lg={4}>
					<Typography sx={{ marginBottom: '10px' }} variant="h4">
						Notice manager (선택된 공지Id: {curManagingNotice === null ? 'X' : curManagingNotice.id})
					</Typography>
					<ManageForm
						curManagingNoticeState={curManagingNoticeState}
						noticeState={noticeState}
						setSnackbarInfo={setSnackbarInfo}
						listRefetch={refetch}
					/>
				</Grid>
			</Grid>
		</Wrapper>
	);
};

export default ManageNotice;
