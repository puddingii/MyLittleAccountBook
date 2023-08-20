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
import axios from 'axios';
import PropTypes from 'prop-types';

import AnimateButton from 'components/@extended/AnimateButton';
import { fixedWriterSchema } from 'validation/spendingAndIncome';
import { useGetCategoryQuery } from 'queries/accountBook/accountBookQuery';

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

const FixedWriter = ({ accountBookId }) => {
	const { data: response } = useGetCategoryQuery(accountBookId);
	const categoryList = response?.data ?? [];

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		/** If success */
		console.log(values);
		setStatus({ success: false });
		setSubmitting(false);
		await axios.get('http://localhost:3044/user/test', { withCredentials: true });
		/** If error */
		// setStatus({ success: false });
		// setErrors({ submit: error?.response?.data?.message });
		// setSubmitting(false);
	};

	return (
		<Formik
			initialValues={{
				writeType: 'f',
				type: 'spending',
				category: '',
				value: 0,
				content: '',
				cycleTime: 1,
				cycleType: 'sd',
				submit: null,
			}}
			validationSchema={fixedWriterSchema}
			onSubmit={handleSubmit}
		>
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
									onInputChange={(event, newInputValue) => {
										const idx = categoryList.findIndex(category => category.categoryNamePath === newInputValue);
										if (idx !== -1) {
											values.category = categoryList[idx].childId;
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

FixedWriter.propTypes = {
	accountBookId: PropTypes.string,
};

export default FixedWriter;
