import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

// material-ui
import { Grid } from '@mui/material';

// project import
import FixedHistoryList from './FixedHistoryList';
import AnalyticEcommerceList from './AnalyticEcommerceList';
import SpendingAndIncomeChart from './SpendingAndIncomeChart';

import { useGetSummaryQuery } from 'queries/accountBook/accountBookQuery';
import { getSocket } from 'socket/realtimeData';
import dayjs from 'dayjs';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const ThisMonthSummary = () => {
	const param = useParams();
	const accountBookId = parseInt(param?.id ?? -1, 10);
	const [notFixedIncomeList, setNotFixedIncomeList] = useState([]);
	const [notFixedSpendingList, setNotFixedSpendingList] = useState([]);
	const [fixedIncomeList, setFixedIncomeList] = useState([]);
	const [fixedSpendingList, setFixedSpendingList] = useState([]);

	const { refetch } = useGetSummaryQuery(
		{
			accountBookId,
		},
		{
			onSuccess: response => {
				setNotFixedIncomeList(response?.data?.notFixedIncomeList ?? []);
				setNotFixedSpendingList(response?.data?.notFixedSpendingList ?? []);
				setFixedIncomeList(response?.data?.fixedIncomeList ?? []);
				setFixedSpendingList(response?.data?.fixedSpendingList ?? []);
			},
		},
	);

	const addNotFixedColumn = column => {
		const curDate = dayjs(column.spendingAndIncomeDate).date() - 1;
		const setter = column.type === 'income' ? setNotFixedIncomeList : setNotFixedSpendingList;

		setter(columnList => {
			const deepClone = JSON.parse(JSON.stringify(columnList));
			deepClone[curDate].push(column);

			return deepClone;
		});
	};

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		const socket = getSocket(accountBookId);
		socket.on('create:nfgab', info => {
			addNotFixedColumn(info);
		});

		socket.connect();

		return () => {
			if (accountBookId && socket.active) {
				socket.disconnect();
			}
		};
	}, [accountBookId]);

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			{/* row 1 */}
			<AnalyticEcommerceList
				fixedIncomeList={fixedIncomeList}
				fixedSpendingList={fixedSpendingList}
				notFixedIncomeList={notFixedIncomeList}
				notFixedSpendingList={notFixedSpendingList}
			/>

			<Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

			{/* row 2 */}
			<Grid item xs={12} md={7} lg={8}>
				<SpendingAndIncomeChart notFixedIncomeList={notFixedIncomeList} notFixedSpendingList={notFixedSpendingList} />
			</Grid>
			<Grid item xs={12} md={5} lg={4}>
				<FixedHistoryList fixedIncomeList={fixedIncomeList} fixedSpendingList={fixedSpendingList} />
			</Grid>
		</Grid>
	);
};

export default ThisMonthSummary;
