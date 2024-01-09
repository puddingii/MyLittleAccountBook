import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// material-ui
import { CircularProgress, Grid, Stack, Typography } from '@mui/material';

// project import
import AuthWrapper from './AuthWrapper';
import { useVerifyEmailMutation } from 'queries/auth/authMutation';

// ================================|| VerificationEmail ||================================ //

const CODE_MESSAGE = {
	1: '이메일 인증이 되었습니다.',
	2: '인증 코드가 만료되었습니다.',
	3: '정보가 일치하지 않습니다. 다시 이메일 인증 시도 해보시길 바랍니다.',
};

const VerificationEmail = () => {
	const [searchParams] = useSearchParams();
	const [completeMessage, setCompleteMessage] = useState('');
	const { mutate, isSuccess } = useVerifyEmailMutation();
	const state = searchParams.get('state');
	const email = searchParams.get('email');

	useEffect(() => {
		if (state && email) {
			mutate(
				{ emailState: state, userEmail: email },
				{
					onSuccess: response => {
						const message = CODE_MESSAGE[response?.data?.code] ?? 'ERROR';
						setCompleteMessage(message);
					},
				},
			);
		}
	}, [state, email, mutate]);

	return (
		<AuthWrapper>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="baseline"
						sx={{ mb: { xs: -0.5, sm: 0.5 } }}
					>
						<Typography variant="h1">이메일 인증</Typography>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					{!isSuccess ? <CircularProgress /> : completeMessage}
				</Grid>
			</Grid>
		</AuthWrapper>
	);
};

export default VerificationEmail;
