import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '../components/Typography';

import { GithubOutlined } from '@ant-design/icons';

function Copyright() {
	return (
		<React.Fragment>
			{'© '}
			<Link color="inherit" href="https://mui.com/">
				나만의 작은 가계부
			</Link>{' '}
			{new Date().getFullYear()}
		</React.Fragment>
	);
}

const iconStyle = {
	width: 48,
	height: 48,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	mr: 1,
	cursor: 'pointer',
};

export default function AppFooter() {
	return (
		<Typography component="footer" sx={{ display: 'flex' }}>
			<Container sx={{ my: 8, display: 'flex' }}>
				<Grid container spacing={5}>
					<Grid item xs={6} sm={4} md={3}>
						<Grid container direction="column" justifyContent="flex-end" spacing={2} sx={{ height: 120 }}>
							<Grid item sx={{ display: 'flex' }}>
								<Box
									component="a"
									sx={iconStyle}
									onClick={() => {
										window.location.href = 'https://github.com/puddingii/MyLittleAccountBook';
									}}
								>
									<GithubOutlined />
								</Box>
							</Grid>
							<Grid item>
								<Copyright />
							</Grid>
						</Grid>
					</Grid>
					{/* <Grid item xs={6} sm={4} md={2}>
						<Typography variant="h6" marked="left" gutterBottom>
							Legal
						</Typography>
						<Box component="ul" sx={{ m: 0, listStyle: 'none', p: 0 }}>
							<Box component="li" sx={{ py: 0.5 }}>
								<Link href="/premium-themes/onepirate/terms/">Terms</Link>
							</Box>
							<Box component="li" sx={{ py: 0.5 }}>
								<Link href="/premium-themes/onepirate/privacy/">Privacy</Link>
							</Box>
						</Box>
					</Grid> */}
				</Grid>
			</Container>
		</Typography>
	);
}
