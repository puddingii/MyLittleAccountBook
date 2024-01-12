import { Fragment, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { QuestionCircleOutlined } from '@ant-design/icons';

import NoticeModal from './NoticeModal';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const settingList = [{ title: '공지사항', icon: <QuestionCircleOutlined /> }];
// <CommentOutlined />
// <UnorderedListOutlined />

const SettingTab = () => {
	const theme = useTheme();
	const [noticeModalInfo, setNoticeModalInfo] = useState({
		name: 'noticeModal',
		idx: 0,
		isOpen: false,
	});
	const [selectedIndex, setSelectedIndex] = useState(-1);

	const clickManager = useMemo(() => {
		return [
			() => {
				setNoticeModalInfo(beforeInfo => ({ ...beforeInfo, isOpen: true }));
			},
		];
	}, [setNoticeModalInfo]);

	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
		clickManager[index]();
	};

	const handleCloseNoticeModal = () => {
		setNoticeModalInfo(beforeInfo => ({ ...beforeInfo, isOpen: false }));
		setNoticeModalInfo(before => ({ ...before, idx: before.idx + 1 }));
		setSelectedIndex(-1);
	};

	return (
		<Fragment>
			<NoticeModal
				key={`${noticeModalInfo.name}${noticeModalInfo.idx}`}
				handleClose={handleCloseNoticeModal}
				open={noticeModalInfo.isOpen}
			/>
			<List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
				{settingList.map((setting, idx) => (
					<ListItemButton
						key={setting.title}
						selected={selectedIndex === idx}
						onClick={event => handleListItemClick(event, idx)}
					>
						<ListItemIcon>{setting.icon}</ListItemIcon>
						<ListItemText primary={setting.title} />
					</ListItemButton>
				))}
			</List>
		</Fragment>
	);
};

export default SettingTab;
