import { useState } from 'react';
import { Box, Table, TableContainer, TablePagination, Paper } from '@mui/material';
import PropTypes from 'prop-types';
import { useDeepCompareMemo } from 'use-deep-compare';

import SortCheckTableHead from './Header';
import SortCheckTableBody from './Body';
import { getComparator, stableSort } from 'utils/sort';
import MainCard from 'components/MainCard';

const SortTable = ({ setInvitedUserList, rows, accountBookId }) => {
	const ROWS_PER_PAGE = 5;
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('index');
	const [page, setPage] = useState(0);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const visibleRows = useDeepCompareMemo(() => {
		return stableSort(rows, getComparator(order, orderBy, ['spendingAndIncomeDate', 'needToUpdateDate'])).slice(
			page * ROWS_PER_PAGE,
			page * ROWS_PER_PAGE + ROWS_PER_PAGE,
		);
	}, [order, orderBy, page, rows]);

	return (
		<MainCard sx={{ mt: 2 }} content={false}>
			<Box sx={{ width: '100%' }}>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<TableContainer sx={{ maxHeight: 250 }}>
						<Table stickyHeader aria-label="collapsible table" aria-labelledby="tableTitle" size={'small'}>
							<SortCheckTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
							<SortCheckTableBody
								visibleRows={visibleRows}
								page={page}
								rowsPerPage={ROWS_PER_PAGE}
								rowCount={rows.length}
								setInvitedUserList={setInvitedUserList}
								accountBookId={accountBookId}
							/>
						</Table>
					</TableContainer>

					<TablePagination
						key="InviteUserTablePagination"
						rowsPerPageOptions={[]}
						component="div"
						count={rows.length}
						rowsPerPage={ROWS_PER_PAGE}
						page={page}
						onPageChange={handleChangePage}
					/>
				</Paper>
			</Box>
		</MainCard>
	);
};

SortTable.propTypes = {
	setInvitedUserList: PropTypes.func.isRequired,
	rows: PropTypes.array.isRequired,
	accountBookId: PropTypes.number.isRequired,
};

export default SortTable;
