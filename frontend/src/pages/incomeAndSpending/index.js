import { useState } from 'react';

// material-ui
import {
	Autocomplete,
	Avatar,
	AvatarGroup,
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	NativeSelect,
	OutlinedInput,
	Stack,
	TextField,
	Typography,
} from '@mui/material';

// project import
import OrdersTable from '../dashboard/OrdersTable';
import MainCard from 'components/MainCard';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { incomeAndSpendingSchema } from 'validation/incomeAndSpending';
import Summary from './Summary';
import WriterCard from './WriterCard';
import axios from 'axios';

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

const IncomeAndSpendingManageBoard = () => {
	const [value, setValue] = useState('today');
	const [slot, setSlot] = useState('week');
	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword(show => !show);

	const handleMouseDownPassword = event => {
		event.preventDefault();
	};

	/**  */
	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		/** If success */
		setStatus({ success: false });
		setSubmitting(false);
		await axios.get('http://localhost:3044/user/test', { withCredentials: true });
		/** If error */
		// setStatus({ success: false });
		// setErrors({ submit: error?.response?.data?.message });
		// setSubmitting(false);
	};

	/** 지출/수입, 카테고리, 서브 카테고리, 금액, 내용 */
	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			{/* row 1 */}
			<Summary income={442236} spending={78250} />

			<Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

			<Grid item xs={12} sm={12} md={12} lg={12}>
				{/* <Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<Typography variant="h5">지출/수입 수기</Typography>
					</Grid>
				</Grid> */}
				<WriterCard>
					<Formik
						initialValues={{
							type: 'income',
							category: '',
							subCategory: '',
							value: 0,
							content: '',
							submit: null,
						}}
						validationSchema={incomeAndSpendingSchema}
						onSubmit={handleSubmit}
					>
						{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
							<form noValidate onSubmit={handleSubmit}>
								<Grid container spacing={3}>
									<Grid item xs={12} sm={6} md={4} lg={1}>
										<Stack spacing={1}>
											<InputLabel htmlFor="is-type">수입/지출</InputLabel>
											<NativeSelect
												defaultValue="income"
												inputProps={{
													name: 'type',
													id: 'is-type',
												}}
												onBlur={handleBlur}
												onChange={handleChange}
												fullWidth
												error={Boolean(touched.category && errors.category)}
											>
												<option value="income">수입</option>
												<option value="spending">지출</option>
											</NativeSelect>
											{touched.type && errors.type && (
												<FormHelperText error id="standard-weight-helper-text-is-type">
													{errors.type}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={12} sm={6} md={4} lg={2}>
										<Stack spacing={1}>
											{/* <Autocomplete
												id="grouped-demo"
												options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
												groupBy={option => option.firstLetter}
												getOptionLabel={option => option.title}
												sx={{ width: 300 }}
												renderInput={params => <TextField {...params} label="With categories" />}
											/> */}
											<InputLabel htmlFor="category">카테고리</InputLabel>
											<OutlinedInput
												id="category"
												type="text"
												value={values.category}
												name="category"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Enter email address"
												fullWidth
												error={Boolean(touched.category && errors.category)}
											/>
											{touched.category && errors.category && (
												<FormHelperText error id="standard-weight-helper-text-category">
													{errors.category}
												</FormHelperText>
											)}
										</Stack>
									</Grid>

									<Grid item xs={12} sm={6} md={4} lg={2}>
										<Stack spacing={1}>
											<InputLabel htmlFor="email-login">이메일</InputLabel>
											<OutlinedInput
												id="email-login"
												type="email"
												value={values.email}
												name="email"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Enter email address"
												fullWidth
												error={Boolean(touched.email && errors.email)}
											/>
											{touched.email && errors.email && (
												<FormHelperText error id="standard-weight-helper-text-email-login">
													{errors.email}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={12} sm={6} md={4} lg={3}>
										<Stack spacing={1}>
											<InputLabel htmlFor="email-login">이메일</InputLabel>
											<OutlinedInput
												id="email-login"
												type="email"
												value={values.email}
												name="email"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Enter email address"
												fullWidth
												error={Boolean(touched.email && errors.email)}
											/>
											{touched.email && errors.email && (
												<FormHelperText error id="standard-weight-helper-text-email-login">
													{errors.email}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={12} sm={6} md={4} lg={2}>
										<Stack spacing={1}>
											<InputLabel htmlFor="email-login">이메일</InputLabel>
											<OutlinedInput
												id="email-login"
												type="email"
												value={values.email}
												name="email"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Enter email address"
												fullWidth
												error={Boolean(touched.email && errors.email)}
											/>
											{touched.email && errors.email && (
												<FormHelperText error id="standard-weight-helper-text-email-login">
													{errors.email}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={12} sm={6} md={4} lg={2}>
										<Stack spacing={1}>
											<InputLabel htmlFor="email-login">이메일</InputLabel>
											<OutlinedInput
												id="email-login"
												type="email"
												value={values.email}
												name="email"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Enter email address"
												fullWidth
												error={Boolean(touched.email && errors.email)}
											/>
											{touched.email && errors.email && (
												<FormHelperText error id="standard-weight-helper-text-email-login">
													{errors.email}
												</FormHelperText>
											)}
										</Stack>
									</Grid>

									{errors.submit && (
										<Grid item xs={12}>
											<FormHelperText error>{errors.submit}</FormHelperText>
										</Grid>
									)}
									<Grid item xs={12}>
										<AnimateButton>
											<Button
												disableElevation
												disabled={isSubmitting}
												fullWidth
												size="large"
												type="submit"
												variant="contained"
												color="primary"
											>
												기록
											</Button>
										</AnimateButton>
									</Grid>
								</Grid>
							</form>
						)}
					</Formik>
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
