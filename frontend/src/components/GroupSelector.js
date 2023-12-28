import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';

// material-ui
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { useGetGroupAccountBookListQuery } from 'queries/group/groupQuery';
import { deleteToken } from 'utils/auth';
import userState from 'recoil/user';
import menuState from 'recoil/menu';

// ==============================|| HEADER CONTENT - GroupSelector ||============================== //

const getBorderColor = isWhiteMode => (isWhiteMode ? 'black' : 'white');

const GroupSelector = ({ matchesXs, boxStyle, isWhiteMode }) => {
	const [userInfo, setUserState] = useRecoilState(userState);
	const [{ defaultId }, setMenuState] = useRecoilState(menuState);
	const [list, setList] = useState([]);
	const { refetch } = useGetGroupAccountBookListQuery({
		onSuccess: response => {
			setList(response?.data ?? []);
		},
		onError: error => {
			if (isExpiredToken(error)) {
				deleteToken('Authorization');
				deleteToken('refresh');
				setUserState(() => ({ email: '', isLogin: false, nickname: '' }));
			}
		},
	});
	const { id } = useParams();
	const curAccountBookId = parseInt(id ?? -1, 10);

	const selectOptions = useMemo(() => {
		return matchesXs ? { maxWidth: 200 } : {};
	}, [matchesXs]);

	const onChangeAccountBook = e => {
		setMenuState(beforeState => ({ ...beforeState, openItem: [defaultId] }));
		location.href = `/group/${e.target.value}/summary`;
	};

	useEffect(() => {
		if (userInfo.isLogin) {
			refetch();
		} else {
			setList([]);
		}
	}, [refetch, id, userInfo.email, userInfo.isLogin]);

	return (
		<Box sx={boxStyle ? boxStyle : { width: '100%', ml: 1 }}>
			<FormControl>
				<InputLabel id="group-selector" style={{ color: getBorderColor(isWhiteMode) }}>
					그룹
				</InputLabel>
				<Select
					sx={{
						...selectOptions,
						'.MuiOutlinedInput-notchedOutline': {
							borderColor: getBorderColor(isWhiteMode),
						},
						'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
							borderColor: getBorderColor(isWhiteMode),
						},
						'&:hover .MuiOutlinedInput-notchedOutline': {
							borderColor: getBorderColor(isWhiteMode),
						},
						'.MuiSvgIcon-root ': {
							fill: 'white !important',
						},
					}}
					labelId="group-selector"
					id="group-selector"
					value={curAccountBookId}
					label="Group"
					onChange={onChangeAccountBook}
				>
					{list.map(info => (
						<MenuItem key={info.accountBookId} value={info.accountBookId}>
							{info.accountBookName}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};

GroupSelector.propTypes = {
	matchesXs: PropTypes.bool,
	boxStyle: PropTypes.object,
	isWhiteMode: PropTypes.bool,
};

export default GroupSelector;
