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
import { useState } from 'react';
import PropTypes from 'prop-types';
import MainCard from 'components/MainCard';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';

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
	const [value, setValue] = useState('total');
	return (
		<>
			<Grid container alignItems="center" justifyContent="space-between">
				<Grid item>
					<Typography variant="h5">고정 지출/수입</Typography>
				</Grid>
				<Grid item>
					<TextField
						id="standard-select-currency"
						size="small"
						select
						value={value}
						onChange={e => setValue(e.target.value)}
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
			<MainCard sx={{ mt: 2, maxHeight: '451px' }} content={false}>
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
					<ListItemButton divider>
						<ListItemAvatar>
							<Avatar
								sx={{
									color: 'success.main',
									bgcolor: 'success.lighter',
								}}
							>
								<GiftOutlined />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={<Typography variant="subtitle1">Order #002434</Typography>}
							secondary="Today, 2:00 AM"
						/>
						<ListItemSecondaryAction>
							<Stack alignItems="flex-end">
								<Typography variant="subtitle1" noWrap>
									+ $1,430
								</Typography>
								<Typography variant="h6" color="secondary" noWrap>
									78%
								</Typography>
							</Stack>
						</ListItemSecondaryAction>
					</ListItemButton>
					<ListItemButton divider>
						<ListItemAvatar>
							<Avatar
								sx={{
									color: 'primary.main',
									bgcolor: 'primary.lighter',
								}}
							>
								<MessageOutlined />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={<Typography variant="subtitle1">Order #984947</Typography>}
							secondary="5 August, 1:45 PM"
						/>
						<ListItemSecondaryAction>
							<Stack alignItems="flex-end">
								<Typography variant="subtitle1" noWrap>
									+ $302
								</Typography>
								<Typography variant="h6" color="secondary" noWrap>
									8%
								</Typography>
							</Stack>
						</ListItemSecondaryAction>
					</ListItemButton>
					<ListItemButton>
						<ListItemAvatar>
							<Avatar
								sx={{
									color: 'error.main',
									bgcolor: 'error.lighter',
								}}
							>
								<SettingOutlined />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={<Typography variant="subtitle1">Order #988784</Typography>}
							secondary="7 hours ago"
						/>
						<ListItemSecondaryAction>
							<Stack alignItems="flex-end">
								<Typography variant="subtitle1" noWrap>
									+ $682
								</Typography>
								<Typography variant="h6" color="secondary" noWrap>
									16%
								</Typography>
							</Stack>
						</ListItemSecondaryAction>
					</ListItemButton>
					<ListItemButton>
						<ListItemAvatar>
							<Avatar
								sx={{
									color: 'error.main',
									bgcolor: 'error.lighter',
								}}
							>
								<SettingOutlined />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={<Typography variant="subtitle1">Order #988784</Typography>}
							secondary="7 hours ago"
						/>
						<ListItemSecondaryAction>
							<Stack alignItems="flex-end">
								<Typography variant="subtitle1" noWrap>
									+ $682
								</Typography>
								<Typography variant="h6" color="secondary" noWrap>
									16%
								</Typography>
							</Stack>
						</ListItemSecondaryAction>
					</ListItemButton>
					<ListItemButton>
						<ListItemAvatar>
							<Avatar
								sx={{
									color: 'error.main',
									bgcolor: 'error.lighter',
								}}
							>
								<SettingOutlined />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={<Typography variant="subtitle1">Order #988784</Typography>}
							secondary="7 hours ago"
						/>
						<ListItemSecondaryAction>
							<Stack alignItems="flex-end">
								<Typography variant="subtitle1" noWrap>
									+ $682
								</Typography>
								<Typography variant="h6" color="secondary" noWrap>
									16%
								</Typography>
							</Stack>
						</ListItemSecondaryAction>
					</ListItemButton>
					<ListItemButton>
						<ListItemAvatar>
							<Avatar
								sx={{
									color: 'error.main',
									bgcolor: 'error.lighter',
								}}
							>
								<SettingOutlined />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={<Typography variant="subtitle1">Order #988784</Typography>}
							secondary="7 hours ago"
						/>
						<ListItemSecondaryAction>
							<Stack alignItems="flex-end">
								<Typography variant="subtitle1" noWrap>
									+ $682
								</Typography>
								<Typography variant="h6" color="secondary" noWrap>
									16%
								</Typography>
							</Stack>
						</ListItemSecondaryAction>
					</ListItemButton>
					<ListItemButton>
						<ListItemAvatar>
							<Avatar
								sx={{
									color: 'error.main',
									bgcolor: 'error.lighter',
								}}
							>
								<SettingOutlined />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={<Typography variant="subtitle1">Order #988784</Typography>}
							secondary="7 hours ago"
						/>
						<ListItemSecondaryAction>
							<Stack alignItems="flex-end">
								<Typography variant="subtitle1" noWrap>
									+ $682
								</Typography>
								<Typography variant="h6" color="secondary" noWrap>
									16%
								</Typography>
							</Stack>
						</ListItemSecondaryAction>
					</ListItemButton>
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
