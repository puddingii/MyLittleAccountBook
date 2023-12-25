import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

// material-ui
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useGetGroupAccountBookListQuery } from 'queries/group/groupQuery';
import userState from 'recoil/user';
import { useRecoilState, useRecoilValue } from 'recoil';
import menuState from 'recoil/menu';

// ==============================|| HEADER CONTENT - GroupSelector ||============================== //

const GroupSelector = ({ matchesXs }) => {
	const [{ defaultId }, setMenuState] = useRecoilState(menuState);
	const [list, setList] = useState([]);
	const { refetch } = useGetGroupAccountBookListQuery({
		onSuccess: response => {
			setList(response?.data ?? []);
		},
	});
	const { id } = useParams();
	const curAccountBookId = parseInt(id, 10);
	const userInfo = useRecoilValue(userState);

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
		<Box sx={{ width: '100%', ml: 1 }}>
			<FormControl>
				<InputLabel id="group-selector">그룹</InputLabel>
				<Select
					sx={selectOptions}
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
};

export default GroupSelector;
