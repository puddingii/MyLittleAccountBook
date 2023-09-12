import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
	Button,
	Divider,
	FormHelperText,
	Grid,
	Link,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
} from '@mui/material';

// third party
import { loginSchema } from 'validation/user';
import { Formik } from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useEmailLoginMutation } from 'queries/auth/authMutation';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
	const [showPassword, setShowPassword] = React.useState(false);
	const { mutate: emailMutate } = useEmailLoginMutation();

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = event => {
		event.preventDefault();
	};

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		emailMutate(values, {
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

	return (
		<>
			<Formik
				initialValues={{
					email: '',
					password: '',
					submit: null,
				}}
				validationSchema={loginSchema}
				onSubmit={handleSubmit}
			>
				{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="email-login">이메일</InputLabel>
									<OutlinedInput
										id="email-login"
										type="email"
										value={values.email}
										name="email"
										onBlur={handleBlur}
										onChange={handleChange}
										placeholder="Enter email address"
										fullWidth
										error={Boolean(touched.email && errors.email)}
									/>
									{touched.email && errors.email && (
										<FormHelperText error id="standard-weight-helper-text-email-login">
											{errors.email}
										</FormHelperText>
									)}
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="password-login">비밀번호</InputLabel>
									<OutlinedInput
										fullWidth
										error={Boolean(touched.password && errors.password)}
										id="-password-login"
										type={showPassword ? 'text' : 'password'}
										value={values.password}
										name="password"
										onBlur={handleBlur}
										onChange={handleChange}
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
										placeholder="Enter password"
									/>
									{touched.password && errors.password && (
										<FormHelperText error id="standard-weight-helper-text-password-login">
											{errors.password}
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
										로그인
									</Button>
								</AnimateButton>
							</Grid>
							<Grid item xs={12} sx={{ mt: -1 }}>
								<Stack direction="row" justifyContent="space-evenly" alignItems="center" spacing={2}>
									<Link variant="h6" component={RouterLink} to="" color="text.primary">
										아이디 찾기
									</Link>
									<Link variant="h6" component={RouterLink} to="" color="text.primary">
										비밀번호 찾기
									</Link>
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Divider>
									<Typography variant="caption"> Login with</Typography>
								</Divider>
							</Grid>
							<Grid item xs={12}>
								<FirebaseSocial />
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</>
	);
};

export default AuthLogin;
