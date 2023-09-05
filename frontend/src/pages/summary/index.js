import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import FixedHistoryList from './FixedHistoryList';
import SpendingAndIncomeChart from './SpendingAndIncomeChart';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import { useGetSummaryQuery } from 'queries/accountBook/accountBookQuery';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const getSum = (list, key) => {
	return list.reduce((acc, cur) => {
		return acc + cur[key];
	}, 0);
};

const ThisMonthSummary = () => {
	const [sumInfo, setSumInfo] = useState({
		notFixedIncomeSum: 0,
		notFixedSpendingSum: 0,
		fixedIncomeSum: 0,
		fixedSpendingSum: 0,
	});
	const param = useParams();
	const accountBookId = parseInt(param?.id ?? -1, 10);

	const { data: response, refetch } = useGetSummaryQuery(
		{
			accountBookId,
		},
		{
			onSuccess: response => {
				const notFixedIncomeSum = (response?.data?.notFixedIncomeList ?? []).reduce((acc, list) => {
					const sum = getSum(list, 'value');
					return acc + sum;
				}, 0);
				const notFixedSpendingSum = (response?.data?.notFixedSpendingList ?? []).reduce((acc, list) => {
					const sum = getSum(list, 'value');
					return acc + sum;
				}, 0);
				const fixedIncomeSum = (response?.data?.fixedIncomeList ?? []).reduce((acc, info) => {
					return acc + info.value;
				}, 0);
				const fixedSpendingSum = (response?.data?.fixedSpendingList ?? []).reduce((acc, info) => {
					return acc + info.value;
				}, 0);
				setSumInfo({
					fixedIncomeSum,
					fixedSpendingSum,
					notFixedIncomeSum,
					notFixedSpendingSum,
				});
			},
		},
	);
	const notFixedIncomeList = response?.data?.notFixedIncomeList ?? [];
	const notFixedSpendingList = response?.data?.notFixedSpendingList ?? [];
	const fixedIncomeList = response?.data?.fixedIncomeList ?? [];
	const fixedSpendingList = response?.data?.fixedSpendingList ?? [];

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			{/* row 1 */}
			<Grid item xs={12} sx={{ mb: -2.25 }}>
				<Typography variant="h5">요약</Typography>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce title="변동 지출" count={sumInfo.notFixedSpendingSum} percentage={59.3} extra="35,000" />
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce title="변동 수입" count={sumInfo.notFixedIncomeSum} percentage={70.5} extra="8,900" />
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce
					title="이번 달의 고정 지출"
					count={sumInfo.fixedSpendingSum}
					percentage={27.4}
					isLoss
					color="warning"
					extra="1,943"
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce
					title="이번 달의 고정 수입"
					count={sumInfo.fixedIncomeSum}
					percentage={27.4}
					isLoss
					color="warning"
					extra="$20,395"
				/>
			</Grid>

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
