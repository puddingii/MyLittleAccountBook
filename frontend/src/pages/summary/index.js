import { useEffect } from 'react';
import { useParams } from 'react-router';

// material-ui
import { Button, Grid } from '@mui/material';

// project import
import FixedHistoryList from './FixedHistoryList';
import AnalyticEcommerceList from './AnalyticEcommerceList';
import SpendingAndIncomeChart from './SpendingAndIncomeChart';

import { useGetSummaryQuery } from 'queries/accountBook/accountBookQuery';
import { getSocket } from 'socket/realtimeData';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const ThisMonthSummary = () => {
	const param = useParams();
	const accountBookId = parseInt(param?.id ?? -1, 10);

	const { data: response, refetch } = useGetSummaryQuery({
		accountBookId,
	});
	const notFixedIncomeList = response?.data?.notFixedIncomeList ?? [];
	const notFixedSpendingList = response?.data?.notFixedSpendingList ?? [];
	const fixedIncomeList = response?.data?.fixedIncomeList ?? [];
	const fixedSpendingList = response?.data?.fixedSpendingList ?? [];

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		const socket = getSocket(accountBookId);

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
