import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { Box, TableCell, TableHead, TableRow, TableSortLabel, styled, tableCellClasses } from '@mui/material';
import { useMemo } from 'react';

const fixedHeadCells = [
	{
		id: 'id',
		numeric: false,
		disablePadding: true,
		label: 'ID',
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
		label: '지출/수입',
	},
	{
		id: 'needToUpdateDate',
		numeric: false,
		disablePadding: true,
		label: '다음 등록날짜',
	},
	{
		id: 'category',
		numeric: false,
		disablePadding: true,
		label: '카테고리',
	},
	{
		id: 'value',
		numeric: true,
		disablePadding: false,
		label: '금액',
	},
	{
		id: 'content',
		numeric: false,
		disablePadding: true,
		label: '상세내용',
	},
	{
		id: 'cycle',
		numeric: false,
		disablePadding: true,
		label: '주기',
	},
];

const notFixedHeadCells = [
	{
		id: 'id',
		numeric: false,
		disablePadding: true,
		label: 'ID',
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
		label: '지출/수입',
	},
	{
		id: 'spendingAndIncomeDate',
		numeric: false,
		disablePadding: true,
		label: '날짜',
	},
	{
		id: 'category',
		numeric: false,
		disablePadding: true,
		label: '카테고리',
	},
	{
		id: 'value',
		numeric: true,
		disablePadding: false,
		label: '금액',
	},
	{
		id: 'content',
		numeric: false,
		disablePadding: true,
		label: '상세내용',
	},
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.grey['300'],
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const SortCheckTableHead = ({ order, orderBy, onRequestSort, type }) => {
	const createSortHandler = property => event => {
		onRequestSort(event, property);
	};
	const cellList = useMemo(() => {
		return type === 'nf' ? notFixedHeadCells : fixedHeadCells;
	}, [type]);

	return (
		<TableHead>
			<TableRow>
				<StyledTableCell />
				{cellList.map(headCell => (
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
	type: PropTypes.oneOf(['nf', 'f']).isRequired,
	orderBy: PropTypes.string.isRequired,
};

export default SortCheckTableHead;
