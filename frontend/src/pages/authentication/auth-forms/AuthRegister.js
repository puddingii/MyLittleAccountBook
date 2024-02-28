import { useEffect, useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
	Box,
	Button,
	// Divider,
	FormControl,
	FormHelperText,
	Grid,
	// Link,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
} from '@mui/material';

// third party
import { Formik } from 'formik';
import { joinSchema } from 'validation/user';

// project import
// import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useJoinMutation } from 'queries/auth/authMutation';

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
	const [level, setLevel] = useState();
	const [showPassword, setShowPassword] = useState(false);
	const { mutate: joinMutate } = useJoinMutation();

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		joinMutate(values, {
			onSuccess: () => {
				setStatus({ success: false });
				setSubmitting(false);
			},
			onError: error => {
				setStatus({ success: false });
				setErrors({ submit: error?.response?.data?.message });
				setSubmitting(false);
			},
		});
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = event => {
		event.preventDefault();
	};

	const changePassword = value => {
		const temp = strengthIndicator(value);
		setLevel(strengthColor(temp));
	};

	useEffect(() => {
		changePassword('');
	}, []);

	return (
		<>
			<Formik
				initialValues={{
					email: '',
					nickname: '',
					password: '',
					submit: null,
				}}
				validationSchema={joinSchema}
				onSubmit={handleSubmit}
			>
				{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="nickname-signup">닉네임</InputLabel>
									<OutlinedInput
										fullWidth
										error={Boolean(touched.nickname && errors.nickname)}
										id="nickname-signup"
										value={values.nickname}
										name="nickname"
										onBlur={handleBlur}
										onChange={handleChange}
										placeholder="닉네임"
										inputProps={{}}
									/>
									{touched.nickname && errors.nickname && (
										<FormHelperText error id="helper-text-nickname-signup">
											{errors.nickname}
										</FormHelperText>
									)}
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="email-signup">이메일</InputLabel>
									<OutlinedInput
										fullWidth
										error={Boolean(touched.email && errors.email)}
										id="email-login"
										type="email"
										value={values.email}
										name="email"
										onBlur={handleBlur}
										onChange={handleChange}
										placeholder="demo@company.com"
										inputProps={{}}
									/>
									{touched.email && errors.email && (
										<FormHelperText error id="helper-text-email-signup">
											{errors.email}
										</FormHelperText>
									)}
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="password-signup">패스워드</InputLabel>
									<OutlinedInput
										fullWidth
										error={Boolean(touched.password && errors.password)}
										id="password-signup"
										type={showPassword ? 'text' : 'password'}
										value={values.password}
										name="password"
										onBlur={handleBlur}
										onChange={e => {
											handleChange(e);
											changePassword(e.target.value);
										}}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end"
													size="large"
												>
													{showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
												</IconButton>
											</InputAdornment>
										}
										placeholder="******"
										inputProps={{}}
									/>
									{touched.password && errors.password && (
										<FormHelperText error id="helper-text-password-signup">
											{errors.password}
										</FormHelperText>
									)}
								</Stack>
								<FormControl fullWidth sx={{ mt: 2 }}>
									<Grid container spacing={2} alignItems="center">
										<Grid item>
											<Box
												sx={{
													bgcolor: level?.color,
													width: 85,
													height: 8,
													borderRadius: '7px',
												}}
											/>
										</Grid>
										<Grid item>
											<Typography variant="subtitle1" fontSize="0.75rem">
												{level?.label}
											</Typography>
										</Grid>
									</Grid>
								</FormControl>
							</Grid>
							{/** FIXME 추가필요 */}
							{/* <Grid item xs={12}>
								<Typography variant="body2">
									회원가입시,{' '}
									<Link variant="subtitle2" component={RouterLink} to="#">
										개인정보 처리방침
									</Link>
									에 동의하는 것으로 간주됩니다.
								</Typography>
							</Grid> */}
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
										계정 생성
									</Button>
								</AnimateButton>
							</Grid>
							{/** FIXME 소셜로그인 허가나면 수정할것 */}
							{/* <Grid item xs={12}>
								<Divider>
									<Typography variant="caption">간편 회원가입</Typography>
								</Divider>
							</Grid>
							<Grid item xs={12}>
								<FirebaseSocial />
							</Grid> */}
						</Grid>
					</form>
				)}
			</Formik>
		</>
	);
};

export default AuthRegister;
