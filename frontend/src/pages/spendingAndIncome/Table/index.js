import { useMemo, useState } from 'react';
import { Box, Table, TableContainer, TablePagination, Paper } from '@mui/material';
import PropTypes from 'prop-types';

import SortCheckTableHead from './Header';
import SortCheckTableBody from './Body';

const isDateValue = orderBy => {
	return orderBy === 'spendingAndIncomeDate' || orderBy === 'cycleTime';
};

const descendingComparator = (a, b, orderBy) => {
	const avalue = isDateValue(orderBy) ? new Date(a[orderBy]) : a[orderBy];
	const bvalue = isDateValue(orderBy) ? new Date(b[orderBy]) : b[orderBy];

	if (bvalue < avalue) {
		return -1;
	}
	if (bvalue > avalue) {
		return 1;
	}
	return 0;
};

const getComparator = (order, orderBy) => {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
};

const SortCheckTable = ({ manageType, spendIncomeType, handleClickEdit, rows }) => {
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('id');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const visibleRows = useMemo(() => {
		let filteredRows = rows;
		if (spendIncomeType === 'spending' || spendIncomeType === 'income') {
			filteredRows = filteredRows.filter(row => row.type === spendIncomeType);
		}
		return stableSort(filteredRows, getComparator(order, orderBy)).slice(
			page * rowsPerPage,
			page * rowsPerPage + rowsPerPage,
		);
	}, [order, orderBy, page, rowsPerPage, rows, spendIncomeType]);

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer sx={{ maxHeight: 450 }}>
					<Table stickyHeader aria-label="collapsible table" aria-labelledby="tableTitle" size={'small'}>
						<SortCheckTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} type={manageType} />
						<SortCheckTableBody
							visibleRows={visibleRows}
							page={page}
							rowsPerPage={rowsPerPage}
							rowCount={rows.length}
							type={manageType}
							handleClickEdit={handleClickEdit}
						/>
					</Table>
				</TableContainer>
				<TablePagination
					labelRowsPerPage="페이지당 항목 수"
					labelDisplayedRows={({ from, to, count }) => {
						return `${from}-${to} / 전체 : ${count}`;
					}}
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
};

SortCheckTable.propTypes = {
	manageType: PropTypes.oneOf(['nf', 'f']).isRequired,
	spendIncomeType: PropTypes.oneOf(['all', 'spending', 'income']).isRequired,
	handleClickEdit: PropTypes.func.isRequired,
	rows: PropTypes.array.isRequired,
};

export default SortCheckTable;
