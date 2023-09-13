import {
	Button,
	FormHelperText,
	Grid,
	InputLabel,
	Stack,
	OutlinedInput,
	Input,
	styled,
	CircularProgress,
	Chip,
	Divider,
	Box,
} from '@mui/material';
import { Fragment, memo, useMemo, useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import { updateUserProfileSchema } from 'validation/header';
import uploadPhotoPreview from 'assets/images/uploadPhotoPreviewKR.png';
import { useGetUserQuery } from 'queries/user/userQuery';
import { useRecoilValue } from 'recoil';
import userState from 'recoil/user';
import { useUpdateUserMutation } from 'queries/user/userMutation';

const Image = styled('img')({
	width: 200,
	height: 200,
	margin: 'auto',
	display: 'block',
	maxWidth: '100%',
	maxHeight: '100%',
});

const initialValue = {
	nickname: '',
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

const CreateGroup = ({ setSnackbarInfo }) => {
	const { email } = useRecoilValue(userState);
	const [imageInfo, setImageInfo] = useState({
		state: 'init',
		path: initialValue.imagePath,
	});

	const { data: response } = useGetUserQuery(
		{ email },
		{
			enabled: true,
		},
	);
	const userInfo = response?.data ?? {};
	const formInitialValue = useMemo(() => {
		return { ...initialValue, nickname: userInfo.nickname ?? '', email: userInfo.email ?? '' };
	}, [userInfo.nickname, userInfo.email]);

	const { mutate: updateUserMutate } = useUpdateUserMutation();

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
		updateUserMutate(values, {
			onSuccess: () => {
				setSnackbarInfo({ isOpen: true, message: '수정되었습니다.', severity: 'success' });
				setStatus({ success: false });
				setSubmitting(false);
			},
			onError: error => {
				const errorMessage = error?.response?.data?.message ?? '';
				setSnackbarInfo({ isOpen: true, message: errorMessage, severity: 'error' });
				setStatus({ success: false });
				setErrors({ submit: errorMessage });
				setSubmitting(false);
			},
		});
	};

	return (
		<Fragment>
			<Formik
				initialValues={formInitialValue}
				validationSchema={updateUserProfileSchema}
				enableReinitialize={true}
				onSubmit={handleSubmit}
			>
				{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
					<form noValidate onSubmit={handleSubmit}>
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
											<InputLabel htmlFor="email">
												이메일
												<Chip
													style={{ marginLeft: '10px' }}
													component="span"
													label={`간편 로그인 - ${userInfo.socialType}`}
													variant="outlined"
													color="info"
													size="small"
												/>
											</InputLabel>
											<OutlinedInput id="email" type="text" value={values.email} name="email" disabled fullWidth />
										</Stack>
									</Grid>
									<Grid item xs={12}>
										<Stack spacing={1}>
											<InputLabel htmlFor="nickname">닉네임 </InputLabel>
											<OutlinedInput
												id="nickname"
												type="text"
												value={values.nickname}
												name="nickname"
												onBlur={handleBlur}
												onChange={handleChange}
												fullWidth
												error={Boolean(touched.nickname && errors.nickname)}
											/>
											{touched.nickname && errors.nickname && (
												<FormHelperText error id="standard-weight-helper-text-nickname">
													{errors.nickname}
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
		</Fragment>
	);
};

CreateGroup.propTypes = {
	setSnackbarInfo: PropTypes.func.isRequired,
};

export default CreateGroup;
