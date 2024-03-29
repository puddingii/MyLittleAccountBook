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
import { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AnimateButton from 'components/@extended/AnimateButton';
import { fixedWriterSchema } from 'validation/spendingAndIncome';

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
	writeType: 'f',
	type: 'spending',
	category: '',
	value: 0,
	content: '',
	cycleTime: 1,
	cycleType: 'sd',
	needToUpdateDate: dayjs().add(1, 'day').toDate(),
	submit: null,
};

const FixedWriter = ({
	accountBookId,
	categoryList,
	mutate,
	onMutateSuccess,
	onMutateError,
	customInitialValue,
	isEditForm,
}) => {
	const formInitialValue = { ...initialValue, ...customInitialValue };
	const [autocompleteKey, setAutocompleteKey] = useState(1);

	const sortedCategoryList = categoryList.sort((categoryA, categoryB) => {
		if (categoryA.parentName < categoryB.parentName) return -1;
		if (categoryB.parentName < categoryA.parentName) return 1;
		return 0;
	});

	const categoryDefaultId = (sortedCategoryList ?? []).findIndex(
		category => category.childId === formInitialValue.category,
	);
	const defaultCategory = categoryDefaultId !== -1 ? sortedCategoryList[categoryDefaultId] : undefined;

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
		mutate(
			{ ...values, accountBookId },
			{
				onSuccess: response => {
					onMutateSuccess(response, values);
					setStatus({ success: false });
					setSubmitting(false);
					if (!isEditForm) {
						resetForm({ values: { ...initialValue } });
						setAutocompleteKey(before => before + 1);
					}
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
		<Formik initialValues={formInitialValue} validationSchema={fixedWriterSchema} onSubmit={handleSubmit}>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={4} lg={2}>
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
						<Grid item xs={12} sm={6} md={4} lg={3}>
							<Stack spacing={1}>
								<InputLabel htmlFor="category">카테고리</InputLabel>
								<Autocomplete
									id="category"
									key={autocompleteKey}
									onInputChange={(event, newInputValue) => {
										const idx = sortedCategoryList.findIndex(category => category.categoryNamePath === newInputValue);
										if (idx !== -1) {
											values.category = sortedCategoryList[idx].childId;
											handleChange(event);
										} else {
											setFieldValue('category', '', true);
										}
									}}
									onBlur={handleBlur}
									options={sortedCategoryList}
									groupBy={category => category.parentName}
									getOptionLabel={category => category.categoryNamePath}
									isOptionEqualToValue={(options, values) => options.categoryIdPath === values.categoryIdPath}
									value={values.categoryIdPath}
									renderInput={params => {
										params.InputProps.style = { height: '41px', paddingTop: '4px' };
										if (!params.inputProps.value && defaultCategory) {
											params.inputProps.value = defaultCategory.categoryNamePath;
										}
										return <TextField {...params} />;
									}}
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

						<Grid item xs={12} sm={6} md={4} lg={2}>
							<Stack spacing={1}>
								<InputLabel htmlFor="cycleType">주기 타입</InputLabel>
								<Select
									id="cycleType"
									value={values.cycleType}
									name="cycleType"
									onBlur={handleBlur}
									onChange={handleChange}
									error={Boolean(touched.cycleType && errors.cycleType)}
								>
									<MenuItem value={'sd'}>특정 날마다</MenuItem>
									<MenuItem value={'d'}>일마다</MenuItem>
									<MenuItem value={'w'}>주마다</MenuItem>
									<MenuItem value={'m'}>월마다</MenuItem>
									<MenuItem value={'y'}>년마다</MenuItem>
								</Select>
								{touched.cycleType && errors.cycleType && (
									<FormHelperText error id="standard-weight-helper-text-cycleType">
										{errors.cycleType}
									</FormHelperText>
								)}
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={2}>
							<Stack spacing={1}>
								<InputLabel htmlFor="cycleTime">주기 날짜</InputLabel>
								<OutlinedInput
									id="cycleTime"
									type="number"
									value={values.cycleTime}
									name="cycleTime"
									onBlur={handleBlur}
									onChange={handleChange}
									fullWidth
									error={Boolean(touched.cycleTime && errors.cycleTime)}
								/>
								{touched.cycleTime && errors.cycleTime && (
									<FormHelperText error id="standard-weight-helper-text-cycleTime">
										{errors.cycleTime}
									</FormHelperText>
								)}
							</Stack>
						</Grid>

						<Grid item xs={12} sm={6} md={4} lg={2}>
							<Stack spacing={1}>
								<InputLabel htmlFor="needToUpdateDate">시작할 날짜</InputLabel>
								<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ko'}>
									<DateTimePicker
										shouldDisableDate={date => {
											return date.isSame(dayjs(), 'day') || date.isBefore(dayjs(), 'day');
										}}
										inputFormat="YYYY-MM-DD"
										value={dayjs(values.needToUpdateDate)}
										onChange={newDate => {
											setFieldValue('needToUpdateDate', newDate.toDate(), true);
										}}
										views={['year', 'day']}
										renderInput={params => <TextField {...params} />}
									/>
								</LocalizationProvider>
								{touched.needToUpdateDate && errors.needToUpdateDate && (
									<FormHelperText error id="standard-weight-helper-text-needToUpdateDate">
										{errors.needToUpdateDate}
									</FormHelperText>
								)}
							</Stack>
						</Grid>

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
						{errors.submit && (
							<Grid item xs={12}>
								<FormHelperText error>{errors.submit}</FormHelperText>
							</Grid>
						)}
					</Grid>
				</form>
			)}
		</Formik>
	);
};

FixedWriter.propTypes = {
	accountBookId: PropTypes.number.isRequired,
	categoryList: PropTypes.array.isRequired,
	mutate: PropTypes.func.isRequired,
	onMutateSuccess: PropTypes.func.isRequired,
	onMutateError: PropTypes.func.isRequired,
	customInitialValue: PropTypes.object,
	isEditForm: PropTypes.bool,
};

export default FixedWriter;
