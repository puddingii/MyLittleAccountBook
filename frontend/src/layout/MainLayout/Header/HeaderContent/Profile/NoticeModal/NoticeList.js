// material-ui
import {
	Typography,
	Avatar,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Pagination,
	Stack,
} from '@mui/material';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// assets
import { ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

// avatar style
const avatarSX = {
	width: 36,
	height: 36,
	fontSize: '1rem',
};

// action style
const actionSX = {
	mt: 0.75,
	ml: 1,
	top: 'auto',
	right: 'auto',
	alignSelf: 'flex-start',
	transform: 'none',
};

const NoticeList = ({ list, pageState, endOfPage, noticeState }) => {
	const [page, setPage] = pageState;
	const [curNotice, setCurNotice] = noticeState;

	const handlePagination = (e, value) => {
		if (page !== value) {
			setPage(value);
		}
	};

	return (
		<Stack style={{ display: curNotice === -1 ? '' : 'none' }}>
			<List
				component="nav"
				sx={{
					px: 0,
					py: 0,
					'& .MuiListItemButton-root': {
						py: 1.5,
						'& .MuiAvatar-root': avatarSX,
						'& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' },
					},
					overflow: 'auto',
					maxHeight: '451px',
				}}
			>
				{list.map((notice, idx) => (
					<ListItemButton key={notice.id} onClick={() => setCurNotice(idx)} divider>
						<ListItemAvatar>
							<Avatar
								sx={{
									color: `${notice.isUpdateContent ? 'primary' : 'error'}.main`,
									bgcolor: `${notice.isUpdateContent ? 'primary' : 'error'}.lighter`,
								}}
							>
								{notice.isUpdateContent ? <ClockCircleOutlined /> : <InfoCircleOutlined />}
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={<Typography variant="subtitle1">{notice.title}</Typography>}
							secondary={dayjs(notice.createdAt).format('YYYY년 MM월 DD일')}
						/>
					</ListItemButton>
				))}
			</List>
			<Stack alignItems="center">
				<Pagination onChange={handlePagination} count={endOfPage} />
			</Stack>
		</Stack>
	);
};

NoticeList.propTypes = {
	list: PropTypes.array.isRequired,
	pageState: PropTypes.array.isRequired,
	endOfPage: PropTypes.number.isRequired,
	noticeState: PropTypes.array.isRequired,
};

export default NoticeList;
