import {
	Button,
	FormHelperText,
	Grid,
	InputLabel,
	Stack,
	OutlinedInput,
	Divider,
	TextareaAutosize,
	Box,
} from '@mui/material';
import { useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import { manageNoticeSchema } from 'validation/manageNotice';

const initialValue = {
	title: '',
	content: '',
	submit: null,
};

const ManageForm = ({ noticeState }) => {
	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		try {
			console.log(values);
			setStatus({ success: false });
			setSubmitting(false);
			handleNext();
		} catch (error) {
			setStatus({ success: false });
			setErrors({ submit: error.message });
			setSubmitting(false);
		}
	};

	return (
		<Formik initialValues={initialValue} validationSchema={manageNoticeSchema} onSubmit={handleSubmit}>
			{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
				<form noValidate onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<InputLabel htmlFor="title">공지제목</InputLabel>
								<OutlinedInput
									id="title"
									type="text"
									value={values.title}
									name="title"
									onBlur={handleBlur}
									onChange={handleChange}
									fullWidth
									error={Boolean(touched.title && errors.title)}
								/>
								{touched.title && errors.title && (
									<FormHelperText error id="standard-weight-helper-text-title">
										{errors.title}
									</FormHelperText>
								)}
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<TextareaAutosize
									onBlur={handleBlur}
									onChange={handleChange}
									name="content"
									minRows={18}
									maxRows={18}
								/>
								{touched.content && errors.content && (
									<FormHelperText error id="standard-weight-helper-text-content">
										{errors.content}
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
					<Divider style={{ marginTop: '20px' }} />
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Button variant="contained" color="error">
							삭제
						</Button>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button sx={{ mr: 1 }} variant="contained" color="warning">
							수정
						</Button>
						<Button type="submit" variant="contained" color="info">
							생성
						</Button>
					</Box>
				</form>
			)}
		</Formik>
	);
};

ManageForm.propTypes = {
	noticState: PropTypes.array,
};

export default ManageForm;
