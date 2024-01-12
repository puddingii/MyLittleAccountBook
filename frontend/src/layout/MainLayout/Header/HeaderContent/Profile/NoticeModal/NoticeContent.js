import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const NoticeContent = ({ list, noticeState }) => {
	const [curNotice, setCurNotice] = noticeState;
	const info = list[curNotice] ?? {
		title: 'Error',
		content: 'Page Error... 뒤로가기를 눌러주세요',
		isUpdateContent: false,
		createdAt: 'xxxx-xx-xx',
	};

	return (
		<Card sx={{ display: curNotice === -1 ? 'none' : '' }}>
			<CardContent>
				<Typography variant="h3" component="div">
					{info.title}
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					{dayjs(info.createdAt).format('YYYY-MM-DD HH:mm:ss')}
				</Typography>
				<Typography sx={{ whiteSpace: 'pre-line' }} variant="body1">
					{info.content}
				</Typography>
			</CardContent>
			<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, marginBottom: '5px' }}>
				<Box sx={{ flex: '1 1 auto' }} />
				<Button onClick={() => setCurNotice(-1)} type="button" color="info" variant="contained" sx={{ mr: 1 }}>
					뒤로가기
				</Button>
			</Box>
		</Card>
	);
};

NoticeContent.propTypes = {
	list: PropTypes.array.isRequired,
	noticeState: PropTypes.array.isRequired,
};

export default NoticeContent;
