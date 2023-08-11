// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack, Grid, Typography } from '@mui/material';

// assets
import Google from 'assets/images/icons/google.svg';
import Kakao from 'assets/images/icons/kakao.png';
import { useGetSocialLocationMutate } from 'queries/auth/authMutation';

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

const FirebaseSocial = () => {
	const theme = useTheme();
	const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
	const { mutate, isError, error } = useGetSocialLocationMutate();

	const googleHandler = async () => {
		mutate('Google');
	};

	const kakaoHandler = async () => {
		mutate('Naver');
	};

	return (
		<>
			<Stack
				direction="row"
				spacing={matchDownSM ? 1 : 2}
				justifyContent={matchDownSM ? 'space-around' : 'space-between'}
				sx={{
					'& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 },
				}}
			>
				<Button
					variant="outlined"
					color="secondary"
					fullWidth={!matchDownSM}
					startIcon={<img src={Google} alt="Google" />}
					onClick={googleHandler}
				>
					{!matchDownSM && 'Google'}
				</Button>
				<Button
					variant="outlined"
					color="secondary"
					fullWidth={!matchDownSM}
					startIcon={<img src={Kakao} alt="Kakao" />}
					onClick={kakaoHandler}
				>
					{!matchDownSM && 'Kakao'}
				</Button>
			</Stack>
			{isError && (
				<Grid item xs={12}>
					<Typography variant="h6" color="error" gutterBottom>
						{error?.response?.data?.message}
					</Typography>
				</Grid>
			)}
		</>
	);
};

export default FirebaseSocial;
