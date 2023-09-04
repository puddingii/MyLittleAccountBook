import { useMemo, useState } from 'react';
import { Box, Grid, Tab, Tabs, TextField } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import SortCheckTable from './Table';
import EditModal from './EditModal';

const a11yProps = index => {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
};

const FILTER_LIST = ['all', 'spending', 'income'];

const TableManager = ({
	accountBookId,
	manageType,
	categoryList,
	date,
	rows,
	updateColumn,
	handleDate,
	isFetching,
	setSnackbarInfo,
}) => {
	const [value, setValue] = useState(0);
	const [selectedRow, setSelectedRow] = useState({});
	const filterType = useMemo(() => {
		return FILTER_LIST[value];
	}, [value]);

	const [isOpenModal, setIsOpenModal] = useState(false);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleClickEdit = rowInfo => {
		const copyInfo = { ...rowInfo };
		if (rowInfo.category) {
			const idx = categoryList.findIndex(category => category.categoryNamePath === copyInfo.category);
			copyInfo.category = idx !== -1 ? categoryList[idx].childId : -1;
		}
		setSelectedRow(copyInfo);
		setIsOpenModal(true);
	};

	const handleClickDelete = rowInfo => {
		const copyInfo = { ...rowInfo };
		updateColumn(copyInfo, true);
		setSnackbarInfo({ isOpen: true, message: '삭제되었습니다.', severity: 'success' });
	};

	return (
		<Grid container alignItems="center" justifyContent="space-between">
			<EditModal
				handleClose={() => setIsOpenModal(false)}
				open={isOpenModal}
				accountBookId={accountBookId}
				manageType={manageType}
				categoryList={categoryList}
				selectedRow={selectedRow}
				updateColumn={updateColumn}
				setSnackbarInfo={setSnackbarInfo}
			/>
			<Grid item xs={4} md={4} lg={4} />
			<Grid item xs={4} md={4} lg={4} sx={{ paddingTop: '25px' }}>
				<Box display="flex" justifyContent="center" alignItems="center">
					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ko'}>
						<DateTimePicker
							sx={{ marginRight: '5px' }}
							inputFormat="YYYY년 MM월"
							value={date}
							onChange={handleDate}
							views={['year', 'month']}
							openTo="month"
							renderInput={params => <TextField {...params} />}
						/>
					</LocalizationProvider>
				</Box>
			</Grid>
			<Grid item xs={4} md={4} lg={4} />
			<Box sx={{ padding: '15px 10px', width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
						<Tab label="전체" {...a11yProps(0)} />
						<Tab label="지출" {...a11yProps(1)} />
						<Tab label="수입" {...a11yProps(2)} />
					</Tabs>
				</Box>
				<SortCheckTable
					manageType={manageType}
					spendIncomeType={filterType}
					handleClickEdit={handleClickEdit}
					handleClickDelete={handleClickDelete}
					isFetching={isFetching}
					rows={rows}
				/>
			</Box>
			<Grid item />
		</Grid>
	);
};

TableManager.propTypes = {
	manageType: PropTypes.oneOf(['nf', 'f']).isRequired,
	accountBookId: PropTypes.number.isRequired,
	isFetching: PropTypes.bool.isRequired,
	categoryList: PropTypes.array,
	rows: PropTypes.array,
	updateColumn: PropTypes.func.isRequired,
	handleDate: PropTypes.func.isRequired,
	date: PropTypes.instanceOf(dayjs).isRequired,
	setSnackbarInfo: PropTypes.func.isRequired,
};

export default TableManager;
