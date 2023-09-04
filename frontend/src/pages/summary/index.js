import { useState } from 'react';

// material-ui
import {
	Avatar,
	Grid,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material';

// project import
import SpendingAndIncomeChart from './SpendingAndIncomeChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

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

// sales report status
const status = [
	{
		value: 'today',
		label: 'Today',
	},
	{
		value: 'month',
		label: 'This Month',
	},
	{
		value: 'year',
		label: 'This Year',
	},
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const ThisMonthSummary = () => {
	const [value, setValue] = useState('today');

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			{/* row 1 */}
			<Grid item xs={12} sx={{ mb: -2.25 }}>
				<Typography variant="h5">Dashboard</Typography>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce title="변동 지출" count="4,42,236" percentage={59.3} extra="35,000" />
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce title="변동 수입" count="78,250" percentage={70.5} extra="8,900" />
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce
					title="이번 달의 고정 지출"
					count="18,800"
					percentage={27.4}
					isLoss
					color="warning"
					extra="1,943"
				/>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<AnalyticEcommerce
					title="이번 달의 고정 수입"
					count="$35,078"
					percentage={27.4}
					isLoss
					color="warning"
					extra="$20,395"
				/>
			</Grid>

			<Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

			{/* row 2 */}
			<Grid item xs={12} md={7} lg={8}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">Sales Report</Typography>
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
				<MainCard sx={{ mt: 1.75, maxHeight: '451px' }}>
					<Stack spacing={1.5} sx={{ mb: -12 }}>
						<Typography variant="h6" color="secondary">
							Net Profit
						</Typography>
						<Typography variant="h4">$1560</Typography>
					</Stack>
					<SpendingAndIncomeChart />
				</MainCard>
			</Grid>
			<Grid item xs={12} md={5} lg={4}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">Transaction History</Typography>
					</Grid>
					<Grid item />
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
			</Grid>
		</Grid>
	);
};

export default ThisMonthSummary;
