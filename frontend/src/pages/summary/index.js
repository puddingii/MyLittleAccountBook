import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

// material-ui
import { Grid } from '@mui/material';

// project import
import FixedHistoryList from './FixedHistoryList';
import AnalyticEcommerceList from './AnalyticEcommerceList';
import SpendingAndIncomeChart from './SpendingAndIncomeChart';

import { useGetSummaryQuery } from 'queries/accountBook/accountBookQuery';
import { getSocket } from 'socket/realtimeData';
import dayjs from 'dayjs';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const findCategory = (list, gabId) => {
	const idx = list.findIndex(category => category.gabId === gabId);
	return idx === -1 ? idx : [idx];
};

const findDeepCategory = (list, gabId) => {
	const listLength = list.length;
	for (let i = 0; i < listLength; i++) {
		const categoryListLength = list[i].length;
		for (let j = 0; j < categoryListLength; j++) {
			if (list[i][j].gabId === gabId) {
				return [i, j];
			}
		}
	}

	return -1;
};

const findCategorys = (findFunc, list, list2, gabId) => {
	const result = findFunc(list, gabId);
	if (result === -1) {
		const result2 = findFunc(list2, gabId);
		return result2 === -1 ? result2 : [...result2, 2];
	}

	return [...result, 1];
};

const ThisMonthSummary = () => {
	const param = useParams();
	const accountBookId = parseInt(param?.id ?? -1, 10);
	const socketRef = useRef(null);
	const [notFixedIncomeList, setNotFixedIncomeList] = useState([]);
	const [notFixedSpendingList, setNotFixedSpendingList] = useState([]);
	const [fixedIncomeList, setFixedIncomeList] = useState([]);
	const [fixedSpendingList, setFixedSpendingList] = useState([]);

	const { refetch } = useGetSummaryQuery(
		{
			accountBookId,
		},
		{
			onSuccess: response => {
				setNotFixedIncomeList(response?.data?.notFixedIncomeList ?? []);
				setNotFixedSpendingList(response?.data?.notFixedSpendingList ?? []);
				setFixedIncomeList(response?.data?.fixedIncomeList ?? []);
				setFixedSpendingList(response?.data?.fixedSpendingList ?? []);
			},
		},
	);

	const addNotFixedColumn = useCallback(
		column => {
			const curDate = dayjs(column.spendingAndIncomeDate).date() - 1;
			const setter = column.type === 'income' ? setNotFixedIncomeList : setNotFixedSpendingList;

			setter(columnList => {
				const deepClone = JSON.parse(JSON.stringify(columnList));
				deepClone[curDate].push(column);

				return deepClone;
			});
		},
		[setNotFixedIncomeList, setNotFixedSpendingList],
	);

	const addFixedColumn = useCallback(
		column => {
			const setter = column.type === 'income' ? setFixedIncomeList : setFixedSpendingList;

			setter(columnList => {
				const deepClone = [...columnList];
				deepClone.push(column);

				return deepClone;
			});
		},
		[setFixedIncomeList, setFixedSpendingList],
	);

	const updateNotFixedColumn = useCallback(
		updatedInfo => {
			const result = findCategorys(findDeepCategory, notFixedIncomeList, notFixedSpendingList, updatedInfo.id);

			if (result === -1) {
				return;
			}
			const [x, y, num] = result;
			const setter = num === 1 ? setNotFixedIncomeList : setNotFixedSpendingList;

			setter(columnList => {
				const deepClone = JSON.parse(JSON.stringify(columnList));
				deepClone[x][y] = { ...deepClone[x][y], ...updatedInfo };

				return deepClone;
			});
		},
		[notFixedIncomeList, notFixedSpendingList],
	);

	const updateFixedColumn = useCallback(
		updatedInfo => {
			const result = findCategorys(findCategory, fixedIncomeList, fixedSpendingList, updatedInfo.id);

			if (result === -1) {
				return;
			}
			const [index, num] = result;
			const setter = num === 1 ? setFixedIncomeList : setFixedSpendingList;

			setter(columnList => {
				const deepClone = [...columnList];
				deepClone[index] = { ...deepClone[index], ...updatedInfo };

				return deepClone;
			});
		},
		[fixedIncomeList, fixedSpendingList],
	);

	const deleteNotFixedColumn = useCallback(
		gabId => {
			const result = findCategorys(findDeepCategory, notFixedIncomeList, notFixedSpendingList, gabId);

			if (result === -1) {
				return;
			}
			const [x, y, num] = result;
			const setter = num === 1 ? setNotFixedIncomeList : setNotFixedSpendingList;

			setter(columnList => {
				const deepClone = JSON.parse(JSON.stringify(columnList));
				deepClone[x].splice(y, 1);

				return deepClone;
			});
		},
		[notFixedIncomeList, notFixedSpendingList],
	);

	const deleteFixedColumn = useCallback(
		gabId => {
			const result = findCategorys(findCategory, fixedIncomeList, fixedSpendingList, gabId);

			if (result === -1) {
				return;
			}
			const [index, num] = result;
			const setter = num === 1 ? setFixedIncomeList : setFixedSpendingList;

			setter(columnList => {
				const deepClone = [...columnList];
				deepClone.splice(index, 1);

				return deepClone;
			});
		},
		[fixedIncomeList, fixedSpendingList],
	);

	useEffect(() => {
		refetch();
	}, [refetch, accountBookId]);

	useEffect(() => {
		const socket = getSocket(accountBookId);
		socketRef.current = socket;

		if (accountBookId) {
			socketRef.current.connect();
		}

		return () => {
			if (accountBookId && socketRef.current?.active) {
				socketRef.current.disconnect();
			}
		};
	}, [accountBookId]);

	useEffect(() => {
		const addNFHandler = info => {
			addNotFixedColumn(info);
		};
		const addFHandler = info => {
			addFixedColumn(info);
		};
		const updateNFHandler = info => {
			updateNotFixedColumn(info);
		};
		const updateFHandler = info => {
			updateFixedColumn(info);
		};
		const deleteNFHandler = info => {
			deleteNotFixedColumn(info.id);
		};
		const deleteFHandler = info => {
			deleteFixedColumn(info.id);
		};
		if (socketRef.current) {
			socketRef.current.on('create:nfgab', addNFHandler);
			socketRef.current.on('create:fgab', addFHandler);
			socketRef.current.on('update:nfgab', updateNFHandler);
			socketRef.current.on('update:fgab', updateFHandler);
			socketRef.current.on('delete:nfgab', deleteNFHandler);
			socketRef.current.on('delete:fgab', deleteFHandler);
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.off('create:nfgab', addNFHandler);
				socketRef.current.off('create:fgab', addFHandler);
				socketRef.current.off('update:nfgab', updateNFHandler);
				socketRef.current.off('update:fgab', updateFHandler);
				socketRef.current.off('delete:nfgab', deleteNFHandler);
				socketRef.current.off('delete:fgab', deleteFHandler);
			}
		};
	}, [
		socketRef,
		deleteNotFixedColumn,
		deleteFixedColumn,
		addNotFixedColumn,
		addFixedColumn,
		updateNotFixedColumn,
		updateFixedColumn,
	]);

	return (
		<Grid container rowSpacing={4.5} columnSpacing={2.75}>
			{/* row 1 */}
			<AnalyticEcommerceList
				fixedIncomeList={fixedIncomeList}
				fixedSpendingList={fixedSpendingList}
				notFixedIncomeList={notFixedIncomeList}
				notFixedSpendingList={notFixedSpendingList}
			/>

			<Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

			{/* row 2 */}
			<Grid item xs={12} md={7} lg={8}>
				<SpendingAndIncomeChart notFixedIncomeList={notFixedIncomeList} notFixedSpendingList={notFixedSpendingList} />
			</Grid>
			<Grid item xs={12} md={5} lg={4}>
				<FixedHistoryList fixedIncomeList={fixedIncomeList} fixedSpendingList={fixedSpendingList} />
			</Grid>
		</Grid>
	);
};

export default ThisMonthSummary;
