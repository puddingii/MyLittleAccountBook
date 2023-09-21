import { CloseOutlined } from '@ant-design/icons';
import {
	Avatar,
	Box,
	Button,
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
import { useState } from 'react';
import { EditOutlined } from '@mui/icons-material';
import { Formik } from 'formik';

import { categorySchema } from 'validation/manageCategory';
import { useCreateCategoryMutation, useDeleteCategoryMutation } from 'queries/accountBook/accountBookMutation';
import { getComparator, stableSort } from 'utils/sort';

import MainCard from 'components/MainCard';
import FormDialog from './FormDialog';

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

const CategoryManager = ({
	accountBookId,
	list,
	setList,
	inputLabelName,
	maxLength,
	selectedCategoryIndex,
	onClickCategory,
	parentId,
	setSnackbarInfo,
}) => {
	const initialValue = { name: '', submit: null };
	const [isOpenModal, setIsOpenModal] = useState(false);
	const { mutate: createMutate } = useCreateCategoryMutation();
	const { mutate: deleteMutate } = useDeleteCategoryMutation();

	const handleDeleteButton = index => {
		const categoryId = list[index].id;
		deleteMutate(
			{ id: categoryId, accountBookId },
			{
				onSuccess: () => {
					setList({ id: categoryId, parentId }, 'delete');
				},
				onError: error => {
					setSnackbarInfo({ isOpen: true, message: error?.response?.data?.message, severity: 'error' });
				},
			},
		);
	};
	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		if (list.length >= maxLength) {
			throw new Error(`카테고리를 ${maxLength}개 초과로 만들 수 없습니다.`);
		}
		createMutate(
			{ accountBookId, name: values.name, parentId },
			{
				onSuccess: response => {
					const data = response?.data ?? {};
					setList({ name: values.name, parentId: parentId || null, ...data }, 'add');
					setStatus({ success: false });
					setSubmitting(false);
				},
				onError: error => {
					setSnackbarInfo({ isOpen: true, message: error?.response?.data?.message, severity: 'error' });
					setStatus({ success: false });
					setErrors({ submit: error?.response?.data?.message });
					setSubmitting(false);
				},
			},
		);
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
							{errors.submit && (
								<Grid item xs={12}>
									<FormHelperText error>{errors.submit}</FormHelperText>
								</Grid>
							)}
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
						maxHeight: '500px',
					}}
				>
					{stableSort(list, getComparator('asc', 'name', list)).map((info, idx) => (
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
	inputLabelName: PropTypes.string.isRequired,
	maxLength: PropTypes.number.isRequired,
	accountBookId: PropTypes.number.isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
	parentId: PropTypes.number,
	selectedCategoryIndex: PropTypes.number,
	onClickCategory: PropTypes.func,
};

export default CategoryManager;
