import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';
import groupIcon from 'assets/images/home/groupIcon.png';
import noteIcon from 'assets/images/home/noteIcon.png';
import rotateIcon from 'assets/images/home/rotateIcon.png';

const item = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	px: 5,
};

const ProductValues = () => {
	return (
		<Box component="section" sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'secondary.light' }}>
			<Container sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}>
				<Box
					component="img"
					src="/static/themes/onepirate/productCurvyLines.png"
					alt="curvy lines"
					sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
				/>
				<Grid container spacing={5}>
					<Grid item xs={12} md={4}>
						<Box sx={item}>
							<Box component="img" src={noteIcon} alt="suitcase" sx={{ height: 55 }} />
							<Typography variant="h6" sx={{ my: 5 }}>
								내 통장은 텅장?
							</Typography>
							<Typography variant="h5">
								{'ㄴㄴ 더 이상 텅장이 아닌 삶을 살아보자!'} {'정리하는 습관도 같이 곁들어서 키우는건 어떰??!!?!'}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} md={4}>
						<Box sx={item}>
							<Box component="img" src={groupIcon} alt="graph" sx={{ height: 55 }} />
							<Typography variant="h6" sx={{ my: 5 }}>
								같이 관리하는 가계부?!
							</Typography>
							<Typography variant="h5">
								{'그룹 가계부라고 들어는 봤는가?!'} {'혼자 관리하고 싶은 사람은 그냥 혼자 사용해도 무관!'}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} md={4}>
						<Box sx={item}>
							<Box component="img" src={rotateIcon} alt="clock" sx={{ height: 55 }} />
							<Typography variant="h6" sx={{ my: 5 }}>
								고정 수입/지출 관리?!?!
							</Typography>
							<Typography variant="h5">
								{'설정만 하면 해당 날짜에 자동으로 등록이 된다고?!'} {'아 ㅋㅋ 당장 맛보러 가야겠지?'}
							</Typography>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default ProductValues;
