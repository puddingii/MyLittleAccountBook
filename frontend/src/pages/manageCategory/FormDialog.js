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
import { Fragment } from 'react';
import { Formik } from 'formik';

import { categorySchema } from 'validation/manageCategory';
import { useUpdateCategoryMutation } from 'queries/accountBook/accountBookMutation';

const FormDialog = ({ accountBookId, open, onClose, onSuccess, onError, modalInfo }) => {
	const { mutate: updateMutate } = useUpdateCategoryMutation();
	const { beforeValue, ...categoryInfo } = modalInfo;

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		updateMutate(
			{ ...categoryInfo, accountBookId, name: values.name },
			{
				onSuccess: () => {
					setStatus({ success: false });
					setSubmitting(false);
					onSuccess(values.name);
				},
				onError: error => {
					setStatus({ success: false });
					setErrors({ submit: error?.response?.data?.message });
					setSubmitting(false);
					onError(error);
				},
			},
		);
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
	accountBookId: PropTypes.number.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	modalInfo: PropTypes.object.isRequired,
};

export default FormDialog;
