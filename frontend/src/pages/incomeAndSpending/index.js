import { useState } from 'react';

// material-ui
import {
	Avatar,
	AvatarGroup,
	Button,
	Grid,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material';
import { useParams } from 'react-router';

// project import
import OrdersTable from '../dashboard/OrdersTable';
import MainCard from 'components/MainCard';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import Summary from './Summary';
import WriterCard from './WriterCard';
import NotFixedWriter from './NotFixedWriter';
import FixedWriter from './FixedWriter';

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

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const IncomeAndSpendingManageBoard = () => {
	const [writeType, setWriteType] = useState('nf');
	const param = useParams();
	const accountBookId = param.id;

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			{/* row 1 */}
			<Summary income={'442236'} spending={'78250'} />

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
				<WriterCard>
					{writeType === 'nf' ? (
						<NotFixedWriter accountBookId={accountBookId} />
					) : (
						<FixedWriter accountBookId={accountBookId} />
					)}
				</WriterCard>
			</Grid>

			{/* row 3 */}
			<Grid item xs={12} md={7} lg={8}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">당일 수입/지출</Typography>
					</Grid>
					<Grid item />
				</Grid>
				<MainCard sx={{ mt: 2 }} content={false}>
					<OrdersTable />
				</MainCard>
			</Grid>

			<Grid item xs={12} md={5} lg={4}>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">고정 수입/지출</Typography>
					</Grid>
					<Grid item />
				</Grid>
				<MainCard sx={{ mt: 2 }} content={false}>
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
					</List>
				</MainCard>
				<MainCard sx={{ mt: 2 }}>
					<Stack spacing={3}>
						<Grid container justifyContent="space-between" alignItems="center">
							<Grid item>
								<Stack>
									<Typography variant="h5" noWrap>
										Help & Support Chat
									</Typography>
									<Typography variant="caption" color="secondary" noWrap>
										Typical replay within 5 min
									</Typography>
								</Stack>
							</Grid>
							<Grid item>
								<AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
									<Avatar alt="Remy Sharp" src={avatar1} />
									<Avatar alt="Travis Howard" src={avatar2} />
									<Avatar alt="Cindy Baker" src={avatar3} />
									<Avatar alt="Agnes Walker" src={avatar4} />
								</AvatarGroup>
							</Grid>
						</Grid>
						<Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
							Need Help?
						</Button>
					</Stack>
				</MainCard>
			</Grid>
		</Grid>
	);
};

export default IncomeAndSpendingManageBoard;
