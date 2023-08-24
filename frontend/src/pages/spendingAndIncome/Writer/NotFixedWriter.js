import { Formik } from 'formik';
import { styled, lighten, darken } from '@mui/system';
import {
	Autocomplete,
	Button,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AnimateButton from 'components/@extended/AnimateButton';
import { notFixedWriterSchema } from 'validation/spendingAndIncome';

const GroupHeader = styled('div')(({ theme }) => ({
	position: 'sticky',
	top: '-8px',
	padding: '4px 10px',
	color: theme.palette.primary.main,
	backgroundColor:
		theme.palette.mode === 'light'
			? lighten(theme.palette.primary.light, 0.85)
			: darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
	padding: 0,
});

const initialValue = {
	writeType: 'nf',
	type: 'spending',
	spendingAndIncomeDate: dayjs().toDate(),
	category: -1,
	value: 0,
	content: '',
	submit: null,
};

const NotFixedWriter = ({
	accountBookId,
	categoryList,
	mutate,
	onMutateSuccess,
	onMutateError,
	customInitialValue,
}) => {
	const formInitialValue = { ...initialValue, ...customInitialValue };

	const categoryDefaultId = (categoryList ?? []).findIndex(category => category.childId === formInitialValue.category);
	const defaultCategory = categoryDefaultId !== -1 ? categoryList[categoryDefaultId] : undefined;

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		mutate(
			{ ...values, accountBookId },
			{
				onSuccess: response => {
					onMutateSuccess(response, values);
					setStatus({ success: false });
					setSubmitting(false);
				},
				onError: error => {
					onMutateError(error);
					setStatus({ success: false });
					setErrors({ submit: error?.response?.data?.message });
					setSubmitting(false);
				},
			},
		);
	};

	return (
		<Formik initialValues={formInitialValue} validationSchema={notFixedWriterSchema} onSubmit={handleSubmit}>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={4} lg={1}>
							<Stack spacing={1}>
								<InputLabel htmlFor="type">지출/수입</InputLabel>
								<Select
									id="type"
									value={values.type}
									name="type"
									onBlur={handleBlur}
									onChange={handleChange}
									error={Boolean(touched.type && errors.type)}
								>
									<MenuItem value={'spending'}>지출</MenuItem>
									<MenuItem value={'income'}>수입</MenuItem>
								</Select>
								{touched.type && errors.type && (
									<FormHelperText error id="standard-weight-helper-text-type">
										{errors.type}
									</FormHelperText>
								)}
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={2}>
							<Stack spacing={1}>
								<InputLabel htmlFor="spendingAndIncomeDate">날짜</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ko'}>
									<DateTimePicker
										inputFormat="YYYY-MM-DD"
										value={dayjs(values.spendingAndIncomeDate)}
										onChange={newDate => {
											setFieldValue('spendingAndIncomeDate', newDate.toDate(), true);
										}}
										views={['year', 'day']}
										renderInput={params => <TextField {...params} />}
									/>
								</LocalizationProvider>
								{touched.spendingAndIncomeDate && errors.spendingAndIncomeDate && (
									<FormHelperText error id="standard-weight-helper-text-spendingAndIncomeDate">
										{errors.spendingAndIncomeDate}
									</FormHelperText>
								)}
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={2}>
							<Stack spacing={1}>
								<InputLabel htmlFor="category">카테고리</InputLabel>
								<Autocomplete
									id="category"
									onInputChange={(event, newInputValue) => {
										const idx = categoryList.findIndex(category => category.categoryNamePath === newInputValue);
										if (idx !== -1) {
											setFieldValue('category', categoryList[idx].childId, true);
											handleChange(event);
										} else {
											setFieldValue('category', '', true);
										}
									}}
									onBlur={handleBlur}
									options={categoryList}
									groupBy={category => category.parentName}
									getOptionLabel={category => category.categoryNamePath}
									isOptionEqualToValue={(options, values) => options.categoryIdPath === values.categoryIdPath}
									renderInput={params => {
										params.InputProps.style = { height: '41px', paddingTop: '4px' };
										if (defaultCategory) {
											params.inputProps.value = defaultCategory.categoryNamePath;
										}
										return <TextField {...params} />;
									}}
									// inputValue
									renderGroup={params => (
										<li key={params.key}>
											<GroupHeader>{params.group}</GroupHeader>
											<GroupItems>{params.children}</GroupItems>
										</li>
									)}
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
								<InputLabel htmlFor="value">금액</InputLabel>
								<OutlinedInput
									id="value"
									type="number"
									value={values.value}
									name="value"
									onBlur={handleBlur}
									onChange={handleChange}
									placeholder="Enter value address"
									fullWidth
									error={Boolean(touched.value && errors.value)}
								/>
								{touched.value && errors.value && (
									<FormHelperText error id="standard-weight-helper-text-value">
										{errors.value}
									</FormHelperText>
								)}
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={5}>
							<Stack spacing={1}>
								<InputLabel htmlFor="content">상세 내용</InputLabel>
								<OutlinedInput
									id="content"
									type="text"
									value={values.content}
									name="content"
									onBlur={handleBlur}
									onChange={handleChange}
									fullWidth
									error={Boolean(touched.content && errors.content)}
								/>
								{touched.content && errors.content && (
									<FormHelperText error id="standard-weight-helper-text-content">
										{errors.content}
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
	);
};

NotFixedWriter.propTypes = {
	accountBookId: PropTypes.number.isRequired,
	categoryList: PropTypes.array,
	mutate: PropTypes.func,
	onMutateSuccess: PropTypes.func,
	onMutateError: PropTypes.func,
	customInitialValue: PropTypes.object,
};

export default NotFixedWriter;
