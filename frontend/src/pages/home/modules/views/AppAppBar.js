import { useMediaQuery } from '@mui/material';
import { useRecoilValue } from 'recoil';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '../components/AppBar';
import Toolbar from '../components/Toolbar';
import GroupSelector from 'components/GroupSelector';
import userState from 'recoil/user';

const rightLink = {
	fontSize: 16,
	color: 'common.white',
	ml: 3,
};

const AppAppBar = () => {
	const userInfo = useRecoilValue(userState);
	const matchesXs = useMediaQuery(theme => theme.breakpoints.down('sm'));

	return (
		<div>
			<AppBar position="fixed">
				<Toolbar sx={{ justifyContent: 'space-between' }}>
					<Box sx={{ flex: 1 }} />
					<Link variant="h6" underline="none" color="inherit" href="/" sx={{ fontSize: 24 }}>
						{'나만의 작은 가계부'}
					</Link>
					{userInfo.isLogin ? (
						<GroupSelector
							matchesXs={matchesXs}
							boxStyle={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}
							isWhiteMode={false}
						/>
					) : (
						<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
							<Link color="inherit" variant="h6" underline="none" href="/register" sx={rightLink}>
								{'회원가입'}
							</Link>
							<Link variant="h6" underline="none" href="/login" sx={{ ...rightLink, color: 'secondary.main' }}>
								{'로그인'}
							</Link>
						</Box>
					)}
				</Toolbar>
			</AppBar>
			<Toolbar />
		</div>
	);
};

export default AppAppBar;
