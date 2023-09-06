const isDateValue = (orderBy, dateColumnList) => {
	return dateColumnList.some(dateColumn => dateColumn === orderBy);
};

const descendingComparator = (a, b, orderBy, dateColumnList) => {
	const avalue = isDateValue(orderBy, dateColumnList) ? new Date(a[orderBy]) : a[orderBy];
	const bvalue = isDateValue(orderBy, dateColumnList) ? new Date(b[orderBy]) : b[orderBy];

	if (bvalue < avalue) {
		return -1;
	}
	if (bvalue > avalue) {
		return 1;
	}
	return 0;
};

export const getComparator = (order, orderBy, dateColumnList) => {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy, dateColumnList)
		: (a, b) => -descendingComparator(a, b, orderBy, dateColumnList);
};

export const stableSort = (array, comparator) => {
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
