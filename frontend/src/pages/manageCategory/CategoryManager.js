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
import { Fragment, useState } from 'react';
import { EditOutlined } from '@mui/icons-material';
import { Formik } from 'formik';

import MainCard from 'components/MainCard';
import { categorySchema } from 'validation/manageCategory';

const FormDialog = ({ open, onClose, onSubmit, beforeValue }) => {
	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		try {
			setStatus({ success: false });
			setSubmitting(false);
			onSubmit(values);
		} catch (error) {
			setStatus({ success: false });
			setErrors({ submit: error.message });
			setSubmitting(false);
		}
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<Fragment>
			<Formik
				initialValues={{ name: beforeValue, submit: null }}
				validationSchema={categorySchema}
				onSubmit={handleSubmit}
				enableReinitialize={true}
			>
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
								<Button type="button" onClick={handleClose}>
									취소
								</Button>
								<Button type="submit" onClick={handleSubmit}>
									수정하기
								</Button>
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

const CategoryManager = ({ list, setList, inputLabelName, selectedCategoryIndex, onClickCategory }) => {
	const initialValue = { name: '', submit: null };
	const [isOpenModal, setIsOpenModal] = useState(false);

	const handleDeleteButton = index => {
		console.log(index);
	};
	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		try {
			setStatus({ success: false });
			setSubmitting(false);
		} catch (error) {
			setStatus({ success: false });
			setErrors({ submit: error.message });
			setSubmitting(false);
		}
	};

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
				<Formik initialValues={initialValue} validationSchema={categorySchema} onSubmit={handleSubmit}>
					{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="name">{inputLabelName}</InputLabel>
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
					{list.map((info, idx) => (
						<ListItemButton
							key={idx}
							divider
							selected={idx === selectedCategoryIndex}
							onClick={() => {
								onClickCategory && onClickCategory(idx);
							}}
						>
							<ListItemAvatar>
								<Avatar
									sx={{
										color: 'error.main',
										bgcolor: 'white',
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
	onClickCategory: PropTypes.func,
	inputLabelName: PropTypes.string.isRequired,
	selectedCategoryIndex: PropTypes.number.isRequired,
};

export default CategoryManager;
