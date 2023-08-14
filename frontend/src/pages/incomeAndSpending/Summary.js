import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useMemo } from 'react';

const Summary = ({ income, spending }) => {
	const sum = useMemo(() => {
		return _.round(income - spending, 0);
	}, [income, spending]);

	return (
		<>
			<Grid item xs={12} sx={{ mb: -2.25 }}>
				<Typography variant="h5">지출/수입 관리</Typography>
			</Grid>
			<Grid item xs={12} sm={4} md={4} lg={4}>
				<AnalyticEcommerce title="총 지출" count={spending} />
			</Grid>
			<Grid item xs={12} sm={4} md={4} lg={4}>
				<AnalyticEcommerce title="총 수입" count={income} />
			</Grid>
			<Grid item xs={12} sm={4} md={4} lg={4}>
				<AnalyticEcommerce title="합산" count={sum} isLoss={sum >= 0} />
			</Grid>
		</>
	);
};

Summary.propTypes = {
	income: PropTypes.number,
	spending: PropTypes.number,
};

export default Summary;
