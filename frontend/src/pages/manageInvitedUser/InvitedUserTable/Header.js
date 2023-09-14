import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { Box, TableCell, TableHead, TableRow, TableSortLabel, styled, tableCellClasses } from '@mui/material';

const headCellList = [
	{
		id: 'index',
		numeric: false,
		disablePadding: true,
		label: 'ID',
	},
	{
		id: 'email',
		numeric: false,
		disablePadding: true,
		label: '이메일',
	},
	{
		id: 'nickname',
		numeric: false,
		disablePadding: true,
		label: '닉네임',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: true,
		label: '권한',
	},
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey['100'],
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const SortCheckTableHead = ({ order, orderBy, onRequestSort }) => {
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<StyledTableCell />
				{headCellList.map(headCell => (
					<StyledTableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</StyledTableCell>
				))}
			</TableRow>
		</TableHead>
	);
};

SortCheckTableHead.propTypes = {
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
};

export default SortCheckTableHead;
