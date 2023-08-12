import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';

import CreateGroupModal from 'components/modal/CreateGroupModal';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
	const theme = useTheme();

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
		if (index === 3) {
			setIsOpenModal(true);
		}
	};

	return (
		<>
			<CreateGroupModal handleClose={() => setIsOpenModal(false)} open={isOpenModal} />
			<List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
				<ListItemButton selected={selectedIndex === 0} onClick={event => handleListItemClick(event, 0)}>
					<ListItemIcon>
						<EditOutlined />
					</ListItemIcon>
					<ListItemText primary="프로필 수정" />
				</ListItemButton>
				<ListItemButton selected={selectedIndex === 1} onClick={event => handleListItemClick(event, 1)}>
					<ListItemIcon>
						<UserOutlined />
					</ListItemIcon>
					<ListItemText primary="내 프로필" />
				</ListItemButton>

				<ListItemButton selected={selectedIndex === 3} onClick={event => handleListItemClick(event, 3)}>
					<ListItemIcon>
						<ProfileOutlined />
					</ListItemIcon>
					<ListItemText primary="새 그룹 만들기" />
				</ListItemButton>
				<ListItemButton selected={selectedIndex === 4} onClick={event => handleListItemClick(event, 4)}>
					<ListItemIcon>
						<WalletOutlined />
					</ListItemIcon>
					<ListItemText primary="Billing" />
				</ListItemButton>
				<ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
					<ListItemIcon>
						<LogoutOutlined />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItemButton>
			</List>
		</>
	);
};

ProfileTab.propTypes = {
	handleLogout: PropTypes.func,
};

export default ProfileTab;
