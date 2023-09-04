import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import dayjs from 'dayjs';

// material-ui
import { Alert, Button, Grid, Snackbar, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import WriterCard from './WriterCard';
import TableManager from './TableManager';
import { useGetQuery } from 'queries/accountBook/accountBookQuery';
import userState from 'recoil/user';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const SpendingAndIncomeManageBoard = () => {
	const [date, setDate] = useState(dayjs());
	const [writeType, setWriteType] = useState('nf');
	const [manageType, setManageType] = useState('nf');
	const [notFixedHistoryList, setNotFixedHistoryList] = useState([]);
	const [fixedHistoryList, setFixedHistoryList] = useState([]);
	const [snackbarInfo, setSnackbarInfo] = useState({ isOpen: false, message: '', severity: 'info' });
	const param = useParams();
	const { nickname } = useRecoilValue(userState);
	const accountBookId = parseInt(param?.id ?? -1, 10);

	const {
		data: response,
		refetch,
		isFetching,
	} = useGetQuery(
		{
			accountBookId,
			startDate: date.startOf('month').toDate(),
			endDate: date.endOf('month').toDate(),
		},
		{
			onSuccess: response => {
				setFixedHistoryList(response?.data?.history.fixedList);
				setNotFixedHistoryList(response?.data?.history.notFixedList);
			},
		},
	);

	const categoryList = response?.data?.categoryList ?? [];

	const addHistory = useCallback(
		history => {
			const setFunc = writeType === 'nf' ? setNotFixedHistoryList : setFixedHistoryList;
			setFunc(beforeList => [...beforeList, { ...history, id: beforeList.length, nickname }]);
		},
		[writeType, nickname, setNotFixedHistoryList, setFixedHistoryList],
	);

	const updateColumn = useCallback(
		(updatedHistory, isDelete) => {
			const setFunc = writeType === 'nf' ? setNotFixedHistoryList : setFixedHistoryList;
			const editColumn = copiedList => {
				const idx = copiedList.findIndex(history => history.gabId === updatedHistory.gabId);
				if (idx !== -1) {
					copiedList[idx] = { ...updatedHistory };
				}

				return copiedList;
			};
			const deleteColumn = copiedList => {
				return copiedList.filter(history => history.gabId !== updatedHistory.gabId);
			};

			setFunc(beforeList => {
				const copiedList = [...beforeList];
				return isDelete ? deleteColumn(copiedList) : editColumn(copiedList);
			});
		},
		[writeType, setNotFixedHistoryList, setFixedHistoryList],
	);

	const handleDate = async date => {
		setDate(date);
	};

	const handleCloseSnackbar = () => {
		setSnackbarInfo(beforeInfo => ({ ...beforeInfo, isOpen: false }));
	};

	useEffect(() => {
		refetch();
	}, [refetch, date]);

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			<Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

			<Grid item xs={12} sm={12} md={12} lg={12}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">수입/지출 기록</Typography>
					</Grid>
					<Grid item />
					<Grid item>
						<Stack direction="row" alignItems="center" spacing={0}>
							<Button
								size="small"
								onClick={() => setWriteType('nf')}
								color={writeType === 'nf' ? 'primary' : 'secondary'}
								variant={writeType === 'nf' ? 'outlined' : 'text'}
							>
								변동
							</Button>
							<Button
								size="small"
								onClick={() => setWriteType('f')}
								color={writeType === 'f' ? 'primary' : 'secondary'}
								variant={writeType === 'f' ? 'outlined' : 'text'}
							>
								고정
							</Button>
						</Stack>
					</Grid>
				</Grid>
				<WriterCard
					accountBookId={accountBookId}
					writeType={writeType}
					categoryList={categoryList}
					addHistory={addHistory}
					setSnackbarInfo={setSnackbarInfo}
				/>
			</Grid>

			<Grid item xs={12} md={12} lg={12}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">수입/지출 관리</Typography>
					</Grid>
					<Grid item />
					<Grid item>
						<Stack direction="row" alignItems="center" spacing={0}>
							<Button
								size="small"
								onClick={() => setManageType('nf')}
								color={manageType === 'nf' ? 'primary' : 'secondary'}
								variant={manageType === 'nf' ? 'outlined' : 'text'}
							>
								변동
							</Button>
							<Button
								size="small"
								onClick={() => setManageType('f')}
								color={manageType === 'f' ? 'primary' : 'secondary'}
								variant={manageType === 'f' ? 'outlined' : 'text'}
							>
								고정
							</Button>
						</Stack>
					</Grid>
				</Grid>
				<MainCard sx={{ mt: 2 }} content={false}>
					<TableManager
						manageType={manageType}
						accountBookId={accountBookId}
						categoryList={categoryList}
						rows={manageType === 'nf' ? notFixedHistoryList : fixedHistoryList}
						updateColumn={updateColumn}
						handleDate={handleDate}
						isFetching={isFetching}
						date={date}
						setSnackbarInfo={setSnackbarInfo}
					/>
				</MainCard>
			</Grid>

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
		</Grid>
	);
};

export default SpendingAndIncomeManageBoard;
