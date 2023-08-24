import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { Delete, KeyboardArrowDown, KeyboardArrowUp, Edit } from '@mui/icons-material';
import { TableBody, TableCell, TableRow, Chip, IconButton, Collapse, Button, Grid } from '@mui/material';
import dayjs from 'dayjs';

import { formatCycle } from 'utils';

const SortCheckTableBody = ({ page, visibleRows, rowsPerPage, rowCount, type, handleClickEdit }) => {
	const [open, setOpen] = useState(new Array(visibleRows.length).fill(false));
	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowCount) : 0;

	const handleClickArrow = index => {
		setOpen(list => {
			list[index] = !list[index];
			return [...list];
		});
	};

	return (
		<TableBody>
			{visibleRows.map((row, index) => {
				const labelId = `enhanced-table-checkbox-${index}`;
				const formatedDate = dayjs(type === 'nf' ? row.spendingAndIncomeDate : row.needToUpdateDate).format(
					'YYYY-MM-DD',
				);

				return (
					<Fragment key={row.gabId}>
						<TableRow hover onClick={() => handleClickArrow(index)} tabIndex={-1} sx={{ cursor: 'pointer' }}>
							<TableCell>
								<IconButton aria-label="expand row" size="small" onClick={() => handleClickArrow(index)}>
									{open[index] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
								</IconButton>
							</TableCell>
							<TableCell align="left">{row.gabId}</TableCell>
							<TableCell component="th" id={labelId} scope="row" padding="none">
								{row.nickname}
							</TableCell>
							<TableCell align="left">
								<Chip
									label={row.type === 'income' ? '수입' : '지출'}
									color={row.type === 'income' ? 'success' : 'error'}
									size="small"
								/>
							</TableCell>
							<TableCell align="left">{formatedDate}</TableCell>
							<TableCell align="left">{row.category}</TableCell>
							<TableCell align="right">
								<NumberFormat value={row.value} displayType="text" thousandSeparator="," /> 원
							</TableCell>
							<TableCell align="left">{row.content}</TableCell>
							{type === 'f' && <TableCell align="left">{formatCycle(row.cycleType, row.cycleTime)}</TableCell>}
						</TableRow>
						<TableRow>
							<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
								<Collapse in={open[index]} timeout="auto" unmountOnExit>
									<Grid container alignItems="center" justifyContent="left" sx={{ margin: 1 }} spacing={1}>
										<Grid item sm={2} md={2} lg={2} style={{ paddingTop: 0 }}>
											<Button
												onClick={() => handleClickEdit(visibleRows[index])}
												variant="outlined"
												size="small"
												color="success"
												startIcon={<Edit />}
											>
												수정하기
											</Button>
										</Grid>
										<Grid item sm={2} md={2} lg={2} style={{ paddingTop: 0 }}>
											<Button variant="outlined" size="small" color="error" startIcon={<Delete />}>
												삭제하기
											</Button>
										</Grid>
									</Grid>
								</Collapse>
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
	);
};

SortCheckTableBody.propTypes = {
	visibleRows: PropTypes.array.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	rowCount: PropTypes.number.isRequired,
	type: PropTypes.oneOf(['nf', 'f']).isRequired,
	handleClickEdit: PropTypes.func.isRequired,
};

export default SortCheckTableBody;
