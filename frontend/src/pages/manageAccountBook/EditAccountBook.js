import {
	FormHelperText,
	Grid,
	InputLabel,
	Stack,
	OutlinedInput,
	Typography,
	Box,
	Divider,
	Button,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import { updateAccountBookSchema } from 'validation/manageAccountBook';
import uploadPhotoPreview from 'assets/images/uploadPhotoPreviewKR.png';

import MainCard from 'components/MainCard';
import ImageUploader from 'components/ImageUploader';
import { useUpdateAccountBookMutation } from 'queries/accountBook/accountBookMutation';

const initialValue = {
	title: '',
	content: '',
	imagePath: uploadPhotoPreview,
	submit: null,
};

const EditAccountBook = ({ accountBookInfo, setAccountBookInfo, setSnackbarInfo, accountBookId }) => {
	const [imageInfo, setImageInfo] = useState({
		state: 'init',
		path: initialValue.imagePath,
	});
	const formInitialValue = useMemo(() => {
		return { ...initialValue, title: accountBookInfo.title, content: accountBookInfo.content ?? '' };
	}, [accountBookInfo.title, accountBookInfo.content]);
	const { mutate: updateAccountBookMutate } = useUpdateAccountBookMutation();

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		updateAccountBookMutate(
			{ ...values, accountBookId },
			{
				onSuccess: () => {
					setSnackbarInfo({ isOpen: true, message: '수정되었습니다.', severity: 'success' });
					setAccountBookInfo({ ...values });
					setStatus({ success: false });
					setSubmitting(false);
				},
				onError: error => {
					setSnackbarInfo({ isOpen: true, message: error?.response?.data?.message, severity: 'error' });
					setStatus({ success: false });
					setErrors({ submit: error.message });
					setSubmitting(false);
				},
			},
		);
	};

	return (
		<MainCard sx={{ mt: 2 }} content={false}>
			<Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
				<Formik
					initialValues={formInitialValue}
					validationSchema={updateAccountBookSchema}
					onSubmit={handleSubmit}
					enableReinitialize={true}
				>
					{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container flexDirection="row" spacing={3}>
								<Grid item xs={3}>
									<ImageUploader
										imageInfo={imageInfo}
										setImageInfo={setImageInfo}
										maxImageSize={2}
										onExceedImageSize={() => {
											setSnackbarInfo({
												isOpen: true,
												message: '이미지는 2MB를 초과할 수 없습니다.',
												severity: 'error',
											});
										}}
										onLoad={e => {
											setAccountBookInfo(beforeInfo => ({ ...beforeInfo, image: e.target.result }));
										}}
									/>
								</Grid>
								<Grid item xs={9}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="title">
													가계부 제목{' '}
													<Typography component="span" variant="caption">
														(필수)
													</Typography>
												</InputLabel>
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
												<InputLabel htmlFor="content">설명 </InputLabel>
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
									</Grid>
								</Grid>
								{errors.submit && (
									<Grid item xs={12}>
										<FormHelperText error>{errors.submit}</FormHelperText>
									</Grid>
								)}
							</Grid>
							<Divider style={{ marginTop: '20px' }} />
							<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
								<Box sx={{ flex: '1 1 auto' }} />
								<Button type="submit" variant="contained">
									수정하기
								</Button>
							</Box>
						</form>
					)}
				</Formik>
			</Box>
		</MainCard>
	);
};

EditAccountBook.propTypes = {
	setAccountBookInfo: PropTypes.func.isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
	accountBookId: PropTypes.number.isRequired,
	accountBookInfo: PropTypes.shape({
		title: PropTypes.string.isRequired,
		content: PropTypes.string,
	}),
};

export default EditAccountBook;
