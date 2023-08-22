import { useState } from 'react';
import { Box, Button, Grid, Tab, Tabs, TextField } from '@mui/material';
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

const TableManager = ({ accountBookId, manageType, categoryList }) => {
	const [date, setDate] = useState(dayjs());
	const [value, setValue] = useState(0);
	const [selectedRow, setSelectedRow] = useState({});

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

	return (
		<Grid container alignItems="center" justifyContent="space-between">
			<Button onClick={() => setIsOpenModal(true)}>asdf</Button>
			<EditModal
				handleClose={() => setIsOpenModal(false)}
				open={isOpenModal}
				accountBookId={accountBookId}
				manageType={manageType}
				categoryList={categoryList}
				selectedRow={selectedRow}
			/>
			<Grid item xs={4} md={4} lg={4} />
			<Grid item xs={4} md={4} lg={4} sx={{ paddingTop: '25px' }}>
				<Box display="flex" justifyContent="center" alignItems="center">
					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ko'}>
						<DateTimePicker
							sx={{ marginRight: '5px' }}
							inputFormat="YYYY년 MM월"
							value={date}
							onChange={setDate}
							views={['year', 'month']}
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
				{value === 0 && (
					<SortCheckTable manageType={manageType} spendIncomeType="all" handleClickEdit={handleClickEdit} />
				)}
				{value === 1 && (
					<SortCheckTable manageType={manageType} spendIncomeType="spending" handleClickEdit={handleClickEdit} />
				)}
				{value === 2 && (
					<SortCheckTable manageType={manageType} spendIncomeType="income" handleClickEdit={handleClickEdit} />
				)}
			</Box>
			<Grid item />
		</Grid>
	);
};

TableManager.propTypes = {
	manageType: PropTypes.oneOf(['nf', 'f']).isRequired,
	accountBookId: PropTypes.number.isRequired,
	categoryList: PropTypes.array,
};

export default TableManager;
