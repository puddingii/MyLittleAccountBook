import { Fragment } from 'react';
import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { setComma } from 'utils';

const ExtraTypography = ({ value, title, color }) => {
	return (
		<Typography variant="caption" color="textSecondary">
			{title}{' '}
			<Typography component="span" variant="caption" sx={{ color: `${color}.main` }}>
				{setComma(value)}
			</Typography>{' '}
			원
		</Typography>
	);
};

ExtraTypography.propTypes = {
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	title: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
};

const getSum = (list, key) => {
	return list.reduce((acc, cur) => {
		return acc + cur[key];
	}, 0);
};

const getMax = (list, key) => {
	if (key) {
		return Math.max(...list.map(info => info[key]));
	}
	return Math.max(...list);
};

const AnalyticEcommerceList = ({ notFixedIncomeList, notFixedSpendingList, fixedIncomeList, fixedSpendingList }) => {
	const [notFixedIncomeSum, notFixedIncomeMaxValue] = notFixedIncomeList.reduce(
		(acc, list) => {
			const sum = getSum(list, 'value');
			const max = getMax([getMax(list, 'value'), acc[1]]);
			acc[0] += sum;
			acc[1] = max;
			return acc;
		},
		[0, 0],
	);
	const [notFixedSpendingSum, notFixedSpendingMaxValue] = notFixedSpendingList.reduce(
		(acc, list) => {
			const sum = getSum(list, 'value');
			const max = getMax([getMax(list, 'value'), acc[1]]);
			acc[0] += sum;
			acc[1] = max;
			return acc;
		},
		[0, 0],
	);
	const [fixedIncomeSum, fixedIncomeMaxValue] = fixedIncomeList.reduce(
		(acc, info) => {
			const max = getMax([acc[1], info.value]);
			acc[0] += info.value;
			acc[1] = max;
			return acc;
		},
		[0, 0],
	);
	const [fixedSpendingSum, fixedSpendingMaxValue] = fixedSpendingList.reduce(
		(acc, info) => {
			const max = getMax([acc[1], info.value]);
			acc[0] += info.value;
			acc[1] = max;
			return acc;
		},
		[0, 0],
	);

	return (
		<Fragment>
			<Grid item xs={12} sx={{ mb: -2.25 }}>
				<Typography variant="h5">이번 달 요약</Typography>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce
					title="변동 지출"
					count={notFixedSpendingSum}
					extra={<ExtraTypography color="primary" title="최대 변동 지출건 :" value={notFixedSpendingMaxValue} />}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce
					title="변동 수입"
					count={notFixedIncomeSum}
					extra={<ExtraTypography color="error" title="최대 변동 수입건 :" value={notFixedIncomeMaxValue} />}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce
					title="고정 지출"
					count={fixedSpendingSum}
					isLoss
					extra={<ExtraTypography color="primary" title="최대 고정 지출건 :" value={fixedSpendingMaxValue} />}
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce
					title="고정 수입"
					count={fixedIncomeSum}
					isLoss
					color="warning"
					extra={<ExtraTypography color="error" title="최대 고정 수입건 :" value={fixedIncomeMaxValue} />}
				/>
			</Grid>
		</Fragment>
	);
};

AnalyticEcommerceList.propTypes = {
	notFixedIncomeList: PropTypes.array.isRequired,
	notFixedSpendingList: PropTypes.array.isRequired,
	fixedIncomeList: PropTypes.array.isRequired,
	fixedSpendingList: PropTypes.array.isRequired,
};

export default AnalyticEcommerceList;
