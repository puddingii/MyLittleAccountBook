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
import { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';
import { CheckOutlined } from '@ant-design/icons';

import { updateUserProfileSchema } from 'validation/header';
import { useGetUserQuery } from 'queries/user/userQuery';
import userState from 'recoil/user';

import { useUpdateUserMutation } from 'queries/user/userMutation';
import { useEmailVerficationMutation } from 'queries/auth/authMutation';

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
const timeFormater = num => (num < 10 ? `0${num}` : num);

const CreateGroup = ({ setSnackbarInfo }) => {
	const { email } = useRecoilValue(userState);
	const timer = useRef(null);
	const [seconds, setSeconds] = useState(600);
	const minute = timeFormater(Math.floor(seconds / 60));
	const second = timeFormater(seconds % 60);

	const [imageInfo, setImageInfo] = useState({
		state: 'init',
		path: initialValue.imagePath,
	});
	const [hasResendValidationMail, setHasResendValidationMail] = useState(false);

	const { data: response, refetch: getUserRefetch } = useGetUserQuery(
		{ email },
		{
			enabled: true,
		},
	);
	const userInfo = response?.data ?? {};

	const formInitialValue = useMemo(() => {
		return {
			...initialValue,
			nickname: userInfo.nickname ?? '',
			email: userInfo.email ?? '',
		};
	}, [userInfo.nickname, userInfo.email]);

	const { mutate: updateUserMutate } = useUpdateUserMutation();
	const { mutate: resendValidationEmailMutate, isLoading } = useEmailVerficationMutation();

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

	const handleResendValidationEmail = () => {
		resendValidationEmailMutate(
			{},
			{
				onSuccess: response => {
					const message = response?.message ?? 'ERROR';
					const additionalMessage = response?.data?.code
						? '인증을 단기간에 여러번 호출 시, 인증이 임시 제한될 수도 있습니다.'
						: '';
					setSnackbarInfo({
						isOpen: true,
						message: `${message}${additionalMessage}`,
						severity: response?.data?.code ? 'success' : 'error',
					});
				},
				onError: error => {
					const errorMessage = error?.response?.data?.message ?? 'ERROR';
					setSnackbarInfo({ isOpen: true, message: errorMessage, severity: 'error' });
				},
			},
		);
		setHasResendValidationMail(true);
	};

	useEffect(() => {
		if (hasResendValidationMail) {
			setSeconds(600);
			timer.current = setInterval(() => {
				setSeconds(seconds => seconds - 1);
			}, 1000);
		} else {
			clearInterval(timer.current);
		}

		return () => clearInterval(timer.current);
	}, [hasResendValidationMail]);

	useEffect(() => {
		if (seconds <= 0) {
			getUserRefetch();
			clearInterval(timer.current);
			setSeconds(600);
			setHasResendValidationMail(false);
		}
	}, [seconds, getUserRefetch]);

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
												{userInfo.socialType && (
													<Chip
														style={{ marginLeft: '10px' }}
														component="span"
														label={`간편 로그인 - ${userInfo.socialType}`}
														variant="outlined"
														color="info"
														size="small"
													/>
												)}
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
									<Grid item xs={12}>
										<Stack spacing={1}>
											<InputLabel htmlFor="isAuthenticated">이메일 인증</InputLabel>
											{userInfo.isAuthenticated ? (
												<CheckOutlined style={{ textAlign: 'left', color: 'green' }} />
											) : isLoading ? (
												<CircularProgress color="secondary" />
											) : hasResendValidationMail ? (
												<OutlinedInput
													id="isAuthenticated"
													type="text"
													value={`인증코드 만료대기 시간- ${minute}:${second}`}
													name="isAuthenticated"
													disabled
													fullWidth
												/>
											) : (
												<OutlinedInput
													id="isAuthenticated"
													sx={{ cursor: 'pointer' }}
													type="button"
													value="인증코드 발송"
													name="isAuthenticated"
													onClick={handleResendValidationEmail}
												/>
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
