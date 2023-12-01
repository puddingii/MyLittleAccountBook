import { Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

import { setComma } from 'utils';
import MainCard from 'components/MainCard';

// chart options
const columnChartOptions = {
	chart: {
		type: 'bar',
		height: 430,
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			columnWidth: '30%',
			borderRadius: 4,
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		show: true,
		width: 12,
		colors: ['transparent'],
	},
	xaxis: {},
	yaxis: {
		title: {
			text: '$ (thousands)',
		},
	},
	fill: {
		opacity: 1,
	},
	tooltip: {
		x: {
			formatter(val) {
				return `${dayjs().set('date', val).format('YYYY-MM-DD')}`;
			},
		},
		y: {
			formatter(val) {
				return `${setComma(val)} 원`;
			},
		},
	},
	legend: {
		show: true,
		fontFamily: `'Public Sans', sans-serif`,
		offsetX: 10,
		offsetY: 10,
		labels: {
			useSeriesColors: false,
		},
		markers: {
			width: 16,
			height: 16,
			radius: '50%',
			offsexX: 2,
			offsexY: 2,
		},
		itemMargin: {
			horizontal: 15,
			vertical: 50,
		},
	},
	responsive: [
		{
			breakpoint: 600,
			options: {
				yaxis: {
					show: false,
				},
			},
		},
	],
};

// ==============================|| SALES COLUMN CHART ||============================== //

const SpendingAndIncomeChart = ({ notFixedIncomeList, notFixedSpendingList }) => {
	const theme = useTheme();

	const { primary, secondary } = theme.palette.text;
	const line = theme.palette.divider;

	const warning = theme.palette.warning.main;
	const primaryMain = theme.palette.primary.main;
	const successDark = theme.palette.success.dark;

	const incomeSeries = {
		name: '수입',
		data: notFixedIncomeList.map(infoList => {
			const sum = infoList.reduce((acc, cur) => acc + cur.value, 0);
			return sum;
		}),
	};
	const spendingSeries = {
		name: '지출',
		data: notFixedSpendingList.map(infoList => {
			const sum = infoList.reduce((acc, cur) => acc + cur.value, 0);
			return sum;
		}),
	};
	const [maxIncomeIdx, maxIncomeValue] = incomeSeries.data.reduce(
		(acc, cur, idx) => {
			if (acc[1] < cur) {
				acc[0] = idx;
				acc[1] = cur;
			}
			return acc;
		},
		[-1, -1],
	);
	const [maxSpendingIdx, maxSpendingValue] = spendingSeries.data.reduce(
		(acc, cur, idx) => {
			if (acc[1] < cur) {
				acc[0] = idx;
				acc[1] = cur;
			}
			return acc;
		},
		[-1, -1],
	);

	const [options, setOptions] = useState(columnChartOptions);

	useEffect(() => {
		setOptions(prevState => ({
			...prevState,
			colors: [warning, primaryMain],
			xaxis: {
				categories: Array.from({ length: dayjs().endOf('month').get('date') }, (_, idx) =>
					dayjs()
						.set('date', idx + 1)
						.format('DD'),
				),
				labels: {
					style: {
						colors: secondary,
					},
				},
			},
			yaxis: {
				labels: {
					style: {
						colors: [secondary],
					},
				},
			},
			grid: {
				borderColor: line,
			},
			tooltip: {
				theme: 'light',
			},
			legend: {
				position: 'top',
				horizontalAlign: 'right',
				labels: {
					colors: 'grey.500',
				},
			},
		}));
	}, [primary, secondary, line, warning, primaryMain, successDark]);

	return (
		<>
			<Grid container alignItems="center" justifyContent="space-between">
				<Grid item>
					<Typography variant="h5">지출/수입 차트</Typography>
				</Grid>
				<Grid item />
			</Grid>
			<MainCard sx={{ mt: 1.75, maxHeight: '451px' }}>
				<Stack spacing={1.5} sx={{ mb: -12 }}>
					<Typography variant="h6" color="secondary">
						가장 많은 수입날짜 [
						{dayjs()
							.set('date', maxIncomeIdx + 1)
							.format('MM/DD')}
						] :{' '}
						<Typography component="span" sx={{ color: 'error.main' }}>
							{setComma(maxIncomeValue)} 원
						</Typography>
					</Typography>
					<Typography style={{ marginTop: '0px' }} variant="h6" color="secondary">
						가장 많은 지출날짜 [
						{dayjs()
							.set('date', maxSpendingIdx + 1)
							.format('MM/DD')}
						] :{' '}
						<Typography component="span" sx={{ color: 'primary.main' }}>
							{setComma(maxSpendingValue)} 원
						</Typography>
					</Typography>
					<Typography variant="h4"></Typography>
				</Stack>
				<div id="chart">
					<ReactApexChart options={options} series={[incomeSeries, spendingSeries]} type="bar" height={430} />
				</div>
			</MainCard>
		</>
	);
};

SpendingAndIncomeChart.propTypes = {
	notFixedIncomeList: PropTypes.array.isRequired,
	notFixedSpendingList: PropTypes.array.isRequired,
};

export default SpendingAndIncomeChart;
