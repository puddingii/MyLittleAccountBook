import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '../components/Button';
import Typography from '../components/Typography';

import LoginIcon from 'assets/images/home/login.png';
import InviteIcon from 'assets/images/home/inviteIcon.png';
import WriteIcon from 'assets/images/home/writeIcon.png';

const item = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	px: 5,
};

const number = {
	fontSize: 24,
	fontFamily: 'default',
	color: 'secondary.main',
	fontWeight: 'medium',
};

const image = {
	height: 55,
	my: 4,
};

function ProductHowItWorks() {
	return (
		<Box component="section" sx={{ display: 'flex', bgcolor: 'secondary.light', overflow: 'hidden' }}>
			<Container
				sx={{
					mt: 10,
					mb: 15,
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box
					component="img"
					src="/static/themes/onepirate/productCurvyLines.png"
					alt="curvy lines"
					sx={{
						pointerEvents: 'none',
						position: 'absolute',
						top: -180,
						opacity: 0.7,
					}}
				/>
				<Typography variant="h4" marked="center" component="h2" sx={{ mb: 14 }}>
					어떻게 사용함?
				</Typography>
				<div>
					<Grid container spacing={5}>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={number}>1.</Box>
								<Box component="img" src={LoginIcon} alt="suitcase" sx={image} />
								<Typography variant="h5" align="center">
									아이디를 만들면 자동으로 가계부가 생성!
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={number}>2.</Box>
								<Box component="img" src={InviteIcon} alt="graph" sx={image} />
								<Typography variant="h5" align="center">
									지인들과 같이 쓰고 싶다면, 가계부 관리 탭에서 초대 및 권한 수정!
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={number}>3.</Box>
								<Box component="img" src={WriteIcon} alt="clock" sx={image} />
								<Typography variant="h5" align="center">
									이제 끝! 마음껏 써보자!
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</div>
				<Button color="secondary" size="large" variant="contained" component="a" href="/login" sx={{ mt: 8 }}>
					아직도 맛보러 안감? 당장 ㄱㄱ!
				</Button>
			</Container>
		</Box>
	);
}

export default ProductHowItWorks;
