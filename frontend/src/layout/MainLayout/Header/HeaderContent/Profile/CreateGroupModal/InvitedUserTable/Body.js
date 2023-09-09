import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
	TableBody,
	TableCell,
	TableRow,
	Chip,
	IconButton,
	Dialog,
	DialogTitle,
	List,
	ListItem,
	ListItemButton,
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';

/** owner, manager, writer, observer */
const accessLevelInfo = {
	manager: { text: '관리자', color: 'info' },
	writer: { text: '멤버', color: 'success' },
	observer: { text: '옵저버', color: 'warning' },
};

const AccessLevelPicker = ({ onClose, open }) => {
	const handleClose = () => {
		onClose();
	};

	const handleListItemClick = value => {
		onClose(value);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>권한 선택</DialogTitle>
			<List sx={{ pt: 0 }}>
				{Object.keys(accessLevelInfo).map(key => (
					<ListItem disableGutters key={accessLevelInfo[key].text}>
						<ListItemButton onClick={() => handleListItemClick(key)}>
							<Chip label={accessLevelInfo[key].text} color={accessLevelInfo[key].color} size="small" />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Dialog>
	);
};

AccessLevelPicker.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

const SortCheckTableBody = ({ page, visibleRows, rowsPerPage, rowCount, setInvitedUserList }) => {
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowCount) : 0;
	const [isOpenDialog, setIsOpenDialog] = useState(false);
	const [curPointedIndex, setCurPointedIndex] = useState(-1);

	const handleClickOpen = index => {
		setIsOpenDialog(true);
		setCurPointedIndex(index);
	};

	const handleClose = value => {
		setIsOpenDialog(false);
		if (curPointedIndex !== -1 && value) {
			setInvitedUserList(beforeList => {
				const afterList = [...beforeList];
				afterList[curPointedIndex] = { ...afterList[curPointedIndex], type: value };
				return afterList;
			});
		}
		setCurPointedIndex(-1);
	};

	const handleClickDelete = index => {
		setInvitedUserList(beforeList => {
			return beforeList.filter(info => info.index !== index);
		});
	};

	return (
		<Fragment>
			<AccessLevelPicker open={isOpenDialog} onClose={handleClose} />
			<TableBody>
				{visibleRows.map((row, index) => {
					return (
						<Fragment key={row.index}>
							<TableRow hover tabIndex={-1}>
								<TableCell>
									<IconButton aria-label="expand row" size="small" onClick={() => handleClickDelete(row.index)}>
										<CloseOutlined />
									</IconButton>
								</TableCell>
								<TableCell align="left">{row.index}</TableCell>
								<TableCell align="left">{row.email}</TableCell>

								<TableCell align="left">{row.nickname}</TableCell>
								<TableCell onClick={() => handleClickOpen(index)} align="left">
									<Chip label={accessLevelInfo[row.type]?.text} color={accessLevelInfo[row.type]?.color} size="small" />
								</TableCell>
							</TableRow>
						</Fragment>
					);
				})}
				{emptyRows > 0 && (
					<TableRow
						style={{
							height: 33 * emptyRows,
						}}
					>
						<TableCell colSpan={6} />
					</TableRow>
				)}
			</TableBody>
		</Fragment>
	);
};

SortCheckTableBody.propTypes = {
	visibleRows: PropTypes.array.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	rowCount: PropTypes.number.isRequired,
	setInvitedUserList: PropTypes.func.isRequired,
};

export default SortCheckTableBody;
