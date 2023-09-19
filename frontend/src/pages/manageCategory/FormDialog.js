import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormHelperText,
	Grid,
	InputLabel,
	OutlinedInput,
	Stack,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import { Formik } from 'formik';

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

export default FormDialog;
