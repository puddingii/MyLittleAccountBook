import { CloseOutlined } from '@ant-design/icons';
import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormHelperText,
	Grid,
	InputAdornment,
	InputLabel,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemSecondaryAction,
	ListItemText,
	OutlinedInput,
	Stack,
	Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useDeepCompareMemo } from 'use-deep-compare';

import MainCard from 'components/MainCard';
import { getComparator, stableSort } from 'utils/sort';
import { EditOutlined } from '@mui/icons-material';
import { Fragment, useState } from 'react';

const FormDialog = ({ open, onClose, onSubmit, beforeValue }) => {
	const handleSubmit = () => {
		onSubmit();
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<Fragment>
			<Formik initialValues={{ name: beforeValue }} validationSchema={{}} onSubmit={handleSubmit}>
				{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Dialog open={open} onClose={handleClose}>
							<DialogTitle>카테고리 이름 수정하기</DialogTitle>
							<DialogContent>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Stack spacing={1}>
											<InputLabel htmlFor="name">이름</InputLabel>
											<OutlinedInput
												id="name"
												type="name"
												value={values.name}
												name="name"
												onBlur={handleBlur}
												onChange={handleChange}
												fullWidth
												error={Boolean(touched.name && errors.name)}
												endAdornment={
													<InputAdornment position="end">
														<Button
															type="submit"
															variant="contained"
															color="info"
															aria-label="toggle password visibility"
															edge="end"
														>
															추가하기
														</Button>
													</InputAdornment>
												}
											/>
											{touched.name && errors.name && (
												<FormHelperText error id="standard-weight-helper-text-name">
													{errors.name}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
								</Grid>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose}>취소</Button>
								<Button onClick={handleSubmit}>수정하기</Button>
							</DialogActions>
						</Dialog>
					</form>
				)}
			</Formik>
		</Fragment>
	);
};

FormDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	beforeValue: PropTypes.string.isRequired,
};

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

const CategoryManager = ({ list, setList, inputLabelName }) => {
	const initialValue = {};
	const [isOpenModal, setIsOpenModal] = useState(false);

	const orderedList = useDeepCompareMemo(() => {
		return stableSort(list, getComparator('asc', 'name', list));
	}, [list]);

	const handleDeleteButton = index => {
		console.log(index);
	};
	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {};

	return (
		<MainCard sx={{ mt: 2, height: '635px' }} content={false}>
			<FormDialog
				beforeValue="asdf"
				onClose={() => setIsOpenModal(false)}
				onSubmit={() => {
					setIsOpenModal(false);
					console.log('!');
				}}
				open={isOpenModal}
			/>
			<Box sx={{ p: { xs: 1, sm: 2, md: 3, xl: 4 } }}>
				<Formik initialValues={initialValue} validationSchema={{}} onSubmit={handleSubmit}>
					{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="email">{inputLabelName}</InputLabel>
										<OutlinedInput
											id="email"
											type="email"
											value={values.email}
											name="email"
											onBlur={handleBlur}
											onChange={handleChange}
											fullWidth
											error={Boolean(touched.email && errors.email)}
											endAdornment={
												<InputAdornment position="end">
													<Button
														type="submit"
														variant="contained"
														color="info"
														aria-label="toggle password visibility"
														edge="end"
													>
														추가하기
													</Button>
												</InputAdornment>
											}
										/>
										{touched.email && errors.email && (
											<FormHelperText error id="standard-weight-helper-text-email">
												{errors.email}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
							</Grid>
						</form>
					)}
				</Formik>
				<Divider style={{ marginTop: '20px' }} />
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
						maxHeight: '525px',
					}}
				>
					{orderedList.map((info, idx) => (
						<ListItemButton key={idx} divider>
							<ListItemAvatar>
								<Avatar
									sx={{
										color: 'error.main',
										bgcolor: 'error.lighter',
									}}
									onClick={() => handleDeleteButton(idx)}
								>
									<CloseOutlined />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={<Typography variant="subtitle1">{info.name}</Typography>} />
							<ListItemSecondaryAction>
								<Stack alignItems="flex-end">
									<Button
										color="primary"
										size="small"
										sx={{ fontSize: '0.875rem' }}
										endIcon={<EditOutlined />}
									></Button>
								</Stack>
							</ListItemSecondaryAction>
						</ListItemButton>
					))}
				</List>
			</Box>
		</MainCard>
	);
};

CategoryManager.propTypes = {
	list: PropTypes.array.isRequired,
	setList: PropTypes.func.isRequired,
	inputLabelName: PropTypes.string.isRequired,
};

export default CategoryManager;
