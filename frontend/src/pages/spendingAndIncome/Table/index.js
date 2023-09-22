import { useMemo, useState } from 'react';
import { Box, Table, TableContainer, TablePagination, Paper, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

import SortCheckTableHead from './Header';
import SortCheckTableBody from './Body';
import { getComparator, stableSort } from 'utils/sort';

const SortCheckTable = ({
	manageType,
	spendIncomeType,
	handleClickEdit,
	handleClickDelete,
	rows,
	isFetching,
	setSnackbarInfo,
}) => {
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState(manageType === 'nf' ? 'spendingAndIncomeDate' : 'needToUpdateDate');
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
		return stableSort(filteredRows, getComparator(order, orderBy, ['spendingAndIncomeDate', 'needToUpdateDate'])).slice(
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
						{!isFetching && (
							<SortCheckTableBody
								visibleRows={visibleRows}
								page={page}
								rowsPerPage={rowsPerPage}
								rowCount={rows.length}
								type={manageType}
								handleClickEdit={handleClickEdit}
								handleClickDelete={handleClickDelete}
								setSnackbarInfo={setSnackbarInfo}
							/>
						)}
					</Table>
				</TableContainer>
				{isFetching && (
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '35px' }}>
						<CircularProgress color="secondary" size={100} />
					</Box>
				)}

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
	handleClickDelete: PropTypes.func.isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
	isFetching: PropTypes.bool.isRequired,
	rows: PropTypes.array.isRequired,
};

export default SortCheckTable;
