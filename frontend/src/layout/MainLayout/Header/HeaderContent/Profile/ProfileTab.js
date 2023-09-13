import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { UserOutlined } from '@ant-design/icons';

import CreateGroupModal from './CreateGroupModal';
import UserProfileModal from './UserProfileModal';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const profileList = [{ title: '내 프로필' }, { title: '새 그룹 만들기' }, { title: '로그아웃' }];

const ProfileTab = ({ handleLogout }) => {
	const theme = useTheme();
	const [createGroupModalKey, setCreateGroupModalKey] = useState({
		name: 'createGroup',
		idx: 0,
	});
	const [userProfileModalKey, setUserProfileModalKey] = useState({
		name: 'profile',
		idx: 0,
	});

	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [isOpenCreateGroupModal, setIsOpenCreateGroupModal] = useState(false);
	const [isOpenUserProfileModal, setIsOpenUserProfileModal] = useState(false);

	const clickManager = useMemo(() => {
		return [
			() => {
				setIsOpenUserProfileModal(true);
			},
			() => {
				setIsOpenCreateGroupModal(true);
			},
			() => {
				handleLogout();
			},
		];
	}, [setIsOpenUserProfileModal, setIsOpenCreateGroupModal, handleLogout]);
	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
		clickManager[index]();
	};

	const handleCloseCreateGroupModal = () => {
		setIsOpenCreateGroupModal(false);
		setCreateGroupModalKey(before => ({ ...before, idx: before.idx + 1 }));
		setSelectedIndex(-1);
	};

	const handleCloseUserProfileModal = () => {
		setIsOpenUserProfileModal(false);
		setUserProfileModalKey(before => ({ ...before, idx: before.idx + 1 }));
		setSelectedIndex(-1);
	};

	return (
		<>
			<CreateGroupModal
				key={`${createGroupModalKey.name}${createGroupModalKey.idx}`}
				handleClose={handleCloseCreateGroupModal}
				open={isOpenCreateGroupModal}
			/>
			<UserProfileModal
				key={`${userProfileModalKey.name}${userProfileModalKey.idx}`}
				handleClose={handleCloseUserProfileModal}
				open={isOpenUserProfileModal}
			/>
			<List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
				{profileList.map((profile, idx) => (
					<ListItemButton
						key={profile.title}
						selected={selectedIndex === idx}
						onClick={event => handleListItemClick(event, idx)}
					>
						<ListItemIcon>
							<UserOutlined />
						</ListItemIcon>
						<ListItemText primary={profile.title} />
					</ListItemButton>
				))}
			</List>
		</>
	);
};

ProfileTab.propTypes = {
	handleLogout: PropTypes.func,
};

export default ProfileTab;
