// material-ui
import {
	Avatar,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	Stack,
	Typography,
	Grid,
	MenuItem,
	TextField,
} from '@mui/material';
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import MainCard from 'components/MainCard';

// assets
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { getComparator, stableSort } from 'utils/sort';
import { formatCycle } from 'utils';

// avatar style
const avatarSX = {
	width: 36,
	height: 36,
	fontSize: '1rem',
};

// action style
const actionSX = {
	mt: 0.75,
	ml: 1,
	top: 'auto',
	right: 'auto',
	alignSelf: 'flex-start',
	transform: 'none',
};

const status = [
	{
		value: 'total',
		label: '전체',
	},
	{
		value: 'spending',
		label: '지출',
	},
	{
		value: 'income',
		label: '수입',
	},
];

const FixedHistoryList = ({ fixedIncomeList, fixedSpendingList }) => {
	const [filterType, setFilterType] = useState('total');

	const fixedHistoryList = useMemo(() => {
		let filteredRows = [...fixedIncomeList, ...fixedSpendingList];
		if (filterType !== 'total') {
			filteredRows = filteredRows.filter(row => row.type === filterType);
		}
		return stableSort(filteredRows, getComparator('asc', 'needToUpdateDate', ['needToUpdateDate']));
	}, [fixedIncomeList, fixedSpendingList, filterType]);

	return (
		<>
			<Grid container alignItems="center" justifyContent="space-between">
				<Grid item>
					<Typography variant="h5">고정 지출/수입 상세내용</Typography>
				</Grid>
				<Grid item>
					<TextField
						id="standard-select-currency"
						size="small"
						select
						value={filterType}
						onChange={e => setFilterType(e.target.value)}
						sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
					>
						{status.map(option => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
				</Grid>
			</Grid>
			<MainCard sx={{ mt: 2, height: '442px' }} content={false}>
				<List
					component="nav"
					sx={{
						px: 0,
						py: 0,
						'& .MuiListItemButton-root': {
							py: 1.5,
							'& .MuiAvatar-root': avatarSX,
							'& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
						},
						overflow: 'auto',
						maxHeight: '451px',
					}}
				>
					{fixedHistoryList.map(fixedHistory => (
						<ListItemButton key={fixedHistory.id} divider>
							<ListItemAvatar>
								<Avatar
									sx={{
										color: `${fixedHistory.type === 'spending' ? 'primary' : 'error'}.main`,
										bgcolor: `${fixedHistory.type === 'spending' ? 'primary' : 'error'}.lighter`,
									}}
								>
									{fixedHistory.type === 'spending' ? <DownOutlined /> : <UpOutlined />}
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={<Typography variant="subtitle1">{fixedHistory.content}</Typography>}
								secondary={dayjs(fixedHistory.needToUpdateDate).format('YYYY년 MM월 DD일')}
							/>
							<ListItemSecondaryAction>
								<Stack alignItems="flex-end">
									<Typography variant="subtitle1" noWrap>
										<NumberFormat value={fixedHistory.value} displayType="text" thousandSeparator="," /> 원
									</Typography>
									<Typography variant="h6" color="secondary" noWrap>
										{formatCycle(fixedHistory.cycleType, fixedHistory.cycleTime)}
									</Typography>
								</Stack>
							</ListItemSecondaryAction>
						</ListItemButton>
					))}
				</List>
			</MainCard>
		</>
	);
};

FixedHistoryList.propTypes = {
	fixedIncomeList: PropTypes.array.isRequired,
	fixedSpendingList: PropTypes.array.isRequired,
};

export default FixedHistoryList;
