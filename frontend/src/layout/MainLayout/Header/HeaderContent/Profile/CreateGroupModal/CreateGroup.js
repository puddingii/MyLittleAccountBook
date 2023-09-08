import {
	Button,
	FormHelperText,
	Grid,
	InputLabel,
	Stack,
	OutlinedInput,
	Typography,
	Input,
	styled,
	Divider,
	CircularProgress,
} from '@mui/material';
import { Fragment, memo, useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import MiddleStepButtonGroup from './StepButtonGroup/MiddleStepButtonGroup';
import { createGroupSchema } from 'validation/header';
import uploadPhotoPreview from 'assets/images/uploadPhotoPreviewKR.png';

const Image = styled('img')({
	width: 200,
	height: 200,
	margin: 'auto',
	display: 'block',
	maxWidth: '100%',
	maxHeight: '100%',
});

const initialValue = {
	title: '',
	content: '',
	imagePath: uploadPhotoPreview,
	submit: null,
};

const CustomImage = memo(({ path, state }) => {
	const visibleStyle = { display: state === 'doing' ? 'none' : '' };

	return <Image style={visibleStyle} alt="GroupImage" src={path} />;
});

CustomImage.propTypes = {
	path: PropTypes.string.isRequired,
	state: PropTypes.oneOf(['done', 'doing', 'init', 'error']).isRequired,
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const CreateGroup = ({ handleNext, setGroupInfo, activeStep, step, setSnackbarInfo, ...stepButtonProps }) => {
	const [imageInfo, setImageInfo] = useState({
		state: 'init',
		path: initialValue.imagePath,
	});

	const handleUploadClick = event => {
		const file = event.target.files[0];
		const reader = new FileReader();
		if (!file) {
			return;
		}
		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			setImageInfo({ state: 'doing', path: initialValue.imagePath });
		};
		reader.onload = e => {
			if (e.total > MAX_IMAGE_SIZE) {
				setSnackbarInfo({ isOpen: true, message: '이미지는 2MB를 초과할 수 없습니다.', severity: 'error' });
				setImageInfo({ state: 'error', path: initialValue.imagePath });
				return;
			}
			setGroupInfo(beforeInfo => ({ ...beforeInfo, image: e.target.result }));
			setImageInfo({ state: 'done', path: e.target.result });
		};
		reader.onerror = () => {
			setImageInfo({ state: 'error', path: initialValue.imagePath });
		};
		reader.onabort = () => {
			setImageInfo({ state: 'error', path: initialValue.imagePath });
		};
	};

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		try {
			setGroupInfo({ ...values });
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
		<Fragment>
			<Formik initialValues={initialValue} validationSchema={createGroupSchema} onSubmit={handleSubmit}>
				{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
					<form style={{ display: activeStep !== step ? 'none' : '' }} noValidate onSubmit={handleSubmit}>
						<Grid container flexDirection="row" spacing={3}>
							<Grid item xs={3}>
								<Grid
									sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}
									container
								>
									<Grid item>
										<CustomImage state={imageInfo.state} path={imageInfo.path} />
										<CircularProgress
											style={{ display: imageInfo.state === 'doing' ? '' : 'none' }}
											color="secondary"
											size={100}
										/>
									</Grid>
									<label htmlFor="contained-button-file">
										<Button disabled style={{ marginTop: '10px' }} variant="outlined" color="success" component="span">
											업데이트 예정
											<Input
												sx={{ display: 'none' }}
												disabled
												type="file"
												inputProps={{ accept: 'image/png, image/jpg, image/jpeg' }}
												id="contained-button-file"
												onInput={handleUploadClick}
											/>
										</Button>
									</label>
								</Grid>
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
						<MiddleStepButtonGroup
							{...stepButtonProps}
							activeStep={activeStep}
							isForm={true}
							handleNext={handleSubmit}
						/>
					</form>
				)}
			</Formik>
		</Fragment>
	);
};

CreateGroup.propTypes = {
	setGroupInfo: PropTypes.func.isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	activeStep: PropTypes.number.isRequired,
	step: PropTypes.number.isRequired,
};

export default CreateGroup;
