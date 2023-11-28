/** Library */
import dayjs from 'dayjs';
import { pipe } from '@fxts/core';

/** Interface */
import { TGetSummary } from '@/interface/api/response/accountBookResponse';
import { TGetDefaultInfo } from '@/interface/service/thisMonthSummaryService';

const filterListByTypeAndDate = <
	T extends { type: string; [key: string]: Date | string | number | undefined },
>(
	list: Array<T>,
	dateName: string,
) => {
	return list.reduce(
		(acc, cur) => {
			const curDate = dayjs(cur[dateName]).date() - 1;
			if (cur.type === 'spending') {
				(acc.spendingList as Array<Array<T>>)[curDate].push(cur);
			} else {
				(acc.incomeList as Array<Array<T>>)[curDate].push(cur);
			}

			return acc;
		},
		{
			spendingList: Array.from({ length: 31 }, () => [] as Array<T>),
			incomeList: Array.from({ length: 31 }, () => [] as Array<T>),
		},
	);
};

const filterListByType = <
	T extends { type: string; [key: string]: Date | string | number | undefined },
>(
	list: Array<T>,
) => {
	return list.reduce(
		(acc, cur) => {
			if (cur.type === 'spending') {
				(acc.spendingList as Array<T>).push(cur);
			} else {
				(acc.incomeList as Array<T>).push(cur);
			}

			return acc;
		},
		{
			spendingList: [] as Array<T>,
			incomeList: [] as Array<T>,
		},
	);
};

/** 이번 달의 History 및 Category 반환(해당 페이지에서 보여줄 기본값 가져오기) */
export const getDefaultInfo =
	(dependencies: TGetDefaultInfo['dependency']) =>
	async (info: TGetDefaultInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			dateUtil: {
				getCurrentDate,
				getFirstDayOfMonth,
				getEndDayOfMonth,
				toDate,
				toString,
			},
			service: { getCategory, getAllTypeColumnList },
		} = dependencies;

		try {
			const { accountBookId } = info;
			const findOptions = {
				...info,
				startDate: pipe(getCurrentDate(), getFirstDayOfMonth, toDate, toString),
				endDate: pipe(getCurrentDate(), getEndDayOfMonth, toDate, toString),
			};
			const categoryList = await getCategory(accountBookId, { start: 2, end: 2 });

			const { fgab, nfgab } = await getAllTypeColumnList(findOptions, categoryList);
			const { incomeList: notFixedIncomeList, spendingList: notFixedSpendingList } =
				filterListByTypeAndDate(nfgab, 'spendingAndIncomeDate');
			const { incomeList: fixedIncomeList, spendingList: fixedSpendingList } =
				filterListByType(fgab);

			return {
				notFixedIncomeList,
				notFixedSpendingList,
				fixedIncomeList,
				fixedSpendingList,
			} satisfies TGetSummary['data'];
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
