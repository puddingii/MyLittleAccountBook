import {
	FormHelperText,
	Grid,
	InputLabel,
	Stack,
	OutlinedInput,
	Button,
	InputAdornment,
	Box,
	Select,
	MenuItem,
} from '@mui/material';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';

import { inviteUserSchema } from 'validation/header';
import userState from 'recoil/user';
import { useAddGroupUserMutation } from 'queries/group/groupMutation';

import MainCard from 'components/MainCard';

const initialValue = {
	email: '',
	type: 'observer',
	submit: null,
};

const typeList = [
	{ key: 'manager', text: '관리자' },
	{ key: 'writer', text: '멤버' },
	{ key: 'observer', text: '옵저버' },
];

const InviteUserForm = ({ invitedUserList, setSnackbarInfo, setInvitedUserList, accountBookId }) => {
	const userInfo = useRecoilValue(userState);
	const { mutate: addUserMutate } = useAddGroupUserMutation();

	const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
		if (userInfo.email === values.email) {
			setSnackbarInfo({ isOpen: true, message: '자신을 추가할 수 없습니다.', severity: 'error' });
			throw Error('자신을 추가할 수 없습니다.');
		}

		const isExistedUser = invitedUserList.findIndex(info => info.email === values.email);
		if (isExistedUser !== -1) {
			setSnackbarInfo({ isOpen: true, message: '이미 추가된 유저입니다.', severity: 'error' });
		}

		addUserMutate(
			{ ...values, accountBookId },
			{
				onSuccess: response => {
					setInvitedUserList(beforeList => {
						const copiedList = [...beforeList];
						copiedList.push({ ...response?.data, type: 'observer', index: copiedList.length });
						return copiedList;
					});
					setSnackbarInfo({ isOpen: true, message: '추가되었습니다.', severity: 'success' });
					setStatus({ success: false });
					setSubmitting(false);
				},
				onError: error => {
					setSnackbarInfo({ isOpen: true, message: error?.response?.data?.message, severity: 'error' });
					setStatus({ success: false });
					setErrors({ submit: error?.response?.data?.message ?? error.message });
					setSubmitting(false);
					setSnackbarInfo({
						isOpen: true,
						message: error?.response?.data?.message ?? error.message,
						severity: 'error',
					});
				},
			},
		);
	};

	return (
		<MainCard sx={{ mt: 2 }} content={false}>
			<Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
				<Formik initialValues={initialValue} validationSchema={inviteUserSchema} onSubmit={handleSubmit}>
					{({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
						<form noValidate onSubmit={handleSubmit}>
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
													<Select
														id="type"
														value={values.type}
														name="type"
														onBlur={handleBlur}
														onChange={handleChange}
														error={Boolean(touched.type && errors.type)}
													>
														{typeList.map(type => (
															<MenuItem key={type.key} value={type.key}>
																{type.text}
															</MenuItem>
														))}
													</Select>
													<Button
														type="submit"
														variant="contained"
														color="info"
														aria-label="toggle password visibility"
														edge="end"
													>
														초대하기
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
						</form>
					)}
				</Formik>
			</Box>
		</MainCard>
	);
};

InviteUserForm.propTypes = {
	invitedUserList: PropTypes.array.isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
	setInvitedUserList: PropTypes.func.isRequired,
	accountBookId: PropTypes.number.isRequired,
};

export default InviteUserForm;
