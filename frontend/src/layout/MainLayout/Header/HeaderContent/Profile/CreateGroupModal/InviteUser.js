import { FormHelperText, Grid, InputLabel, Stack, OutlinedInput, Divider, Button, InputAdornment } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import { inviteUserSchema } from 'validation/header';
import MiddleStepButtonGroup from './StepButtonGroup/MiddleStepButtonGroup';
import SortTable from './InvitedUserTable';
import { useGetUserQuery } from 'queries/user/userQuery';

const initialValue = {
	email: '',
	submit: null,
};

const InviteUser = ({
	invitedUserList,
	setInvitedUserList,
	handleNext,
	activeStep,
	step,
	setSnackbarInfo,
	...stepButtonProps
}) => {
	const [email, setEmail] = useState('');
	const { refetch } = useGetUserQuery(
		{ email },
		{
			onSuccess: response => {
				const isExistedUser = invitedUserList.findIndex(info => info.email === response?.data?.email);
				if (isExistedUser !== -1) {
					setSnackbarInfo({ isOpen: true, message: '이미 추가된 유저입니다.', severity: 'warning' });
					return;
				}
				setInvitedUserList(beforeList => {
					const copiedList = [...beforeList];
					copiedList.push({ ...response?.data, index: copiedList.length, type: 'observer' });
					return copiedList;
				});
				setSnackbarInfo({ isOpen: true, message: '추가되었습니다.', severity: 'success' });
			},
			onError: error => {
				setSnackbarInfo({ isOpen: true, message: error?.response?.data?.message, severity: 'error' });
			},
		},
	);

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		try {
			setStatus({ success: false });
			setSubmitting(false);
			setEmail(values.email);
		} catch (error) {
			setStatus({ success: false });
			setErrors({ submit: error?.response?.data?.message });
			setSubmitting(false);
		}
	};

	useEffect(() => {
		if (email) {
			refetch();
		}
	}, [email, refetch]);

	return (
		<Fragment>
			<Formik initialValues={initialValue} validationSchema={inviteUserSchema} onSubmit={handleSubmit}>
				{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
					<form style={{ display: activeStep !== step ? 'none' : '' }} noValidate onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="email">사용자 이메일</InputLabel>
									<OutlinedInput
										id="email"
										type="email"
										value={values.email}
										name="email"
										onBlur={handleBlur}
										onChange={handleChange}
										fullWidth
										error={Boolean(touched.email && errors.email)}
										endAdornment={
											<InputAdornment position="end">
												<Button
													type="submit"
													variant="contained"
													color="info"
													aria-label="toggle password visibility"
													edge="end"
												>
													추가하기
												</Button>
											</InputAdornment>
										}
									/>
									{touched.email && errors.email && (
										<FormHelperText error id="standard-weight-helper-text-email">
											{errors.email}
										</FormHelperText>
									)}
								</Stack>
							</Grid>
						</Grid>

						<Divider style={{ marginTop: '20px' }} />
						<SortTable rows={invitedUserList} setInvitedUserList={setInvitedUserList} />
						<Divider style={{ marginTop: '20px' }} />
						<MiddleStepButtonGroup
							{...stepButtonProps}
							activeStep={activeStep}
							handleNext={handleNext}
							isForm={false}
						/>
					</form>
				)}
			</Formik>
		</Fragment>
	);
};

InviteUser.propTypes = {
	setSnackbarInfo: PropTypes.func.isRequired,
	setInvitedUserList: PropTypes.func.isRequired,
	invitedUserList: PropTypes.array.isRequired,
	handleNext: PropTypes.func.isRequired,
	activeStep: PropTypes.number.isRequired,
	step: PropTypes.number.isRequired,
};

export default InviteUser;
