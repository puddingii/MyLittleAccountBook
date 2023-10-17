/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, fail, ok } from 'assert';

import { errorUtil } from '../commonDependency';
import { getDefaultInfo } from '@/service/thisMonthSummaryService';
import {
	getFixedColumnList,
	getNotFixedColumnList,
} from '@/service/common/accountBook/dependency';

import { TGet } from '@/interface/api/response/accountBookResponse';

describe('ThisMonthSummary Service Test', function () {
	const common = {
		errorUtil: { convertErrorToCustomError: errorUtil.convertErrorToCustomError },
	};

	describe('#getDefaultInfo', function () {
		it('Check filtering', async function () {
			const curDate = new Date();
			const nextDate = new Date();
			nextDate.setDate(curDate.getDate() + 1);
			const fixedColumnList = [
				{
					id: 1,
					gabId: 3,
					nickname: '사용자 닉네임',
					category: '부모 > 자식',
					type: 'income' as const,
					cycleType: 'sd' as const,
					cycleTime: 1,
					needToUpdateDate: curDate,
					value: 3,
					content: '',
				},
				{
					id: 1,
					gabId: 3,
					nickname: '사용자 닉네임',
					category: '부모 > 자식',
					type: 'spending' as const,
					cycleType: 'sd' as const,
					cycleTime: 1,
					needToUpdateDate: curDate,
					value: 3,
					content: '',
				},
				{
					id: 1,
					gabId: 3,
					nickname: '사용자 닉네임',
					category: '부모 > 자식',
					type: 'income' as const,
					cycleType: 'sd' as const,
					cycleTime: 1,
					needToUpdateDate: nextDate,
					value: 3,
					content: '',
				},
				{
					id: 1,
					gabId: 3,
					nickname: '사용자 닉네임',
					category: '부모 > 자식',
					type: 'income' as const,
					cycleType: 'sd' as const,
					cycleTime: 1,
					needToUpdateDate: nextDate,
					value: 3,
					content: '',
				},
			];
			const notFixedColumnList = [
				{
					id: 1,
					gabId: 3,
					nickname: '사용자 닉네임',
					category: '부모 > 자식2',
					type: 'income' as const,
					spendingAndIncomeDate: curDate,
					value: 3,
					content: '',
				},
				{
					id: 1,
					gabId: 3,
					nickname: '사용자 닉네임',
					category: '부모 > 자식2',
					type: 'spending' as const,
					spendingAndIncomeDate: curDate,
					value: 3,
					content: '',
				},
				{
					id: 1,
					gabId: 3,
					nickname: '사용자 닉네임',
					category: '부모 > 자식2',
					type: 'spending' as const,
					spendingAndIncomeDate: nextDate,
					value: 3,
					content: '',
				},
				{
					id: 1,
					gabId: 3,
					nickname: '사용자 닉네임',
					category: '부모 > 자식2',
					type: 'spending' as const,
					spendingAndIncomeDate: nextDate,
					value: 3,
					content: '',
				},
			];
			const injectedFunc = getDefaultInfo({
				...common,
				service: {
					getCategory: (
						accountBookId: number,
						depth?: {
							start: number;
							end: number;
						},
					) => {
						const parentCategory = [
							{
								parentId: 1,
								childId: 5,
								parentName: '부모',
								categoryNamePath: '부모 > 자식',
								categoryIdPath: '1 > 5',
							},
							{
								parentId: 1,
								childId: 6,
								parentName: '부모',
								categoryNamePath: '부모 > 자식2',
								categoryIdPath: '1 > 6',
							},
						];

						return Promise.resolve([...parentCategory]);
					},
					getFixedColumnList: (
						info: Parameters<typeof getFixedColumnList>[0],
						categoryList: Parameters<typeof getFixedColumnList>[1],
					): Promise<TGet['data']['history']['fixedList']> => {
						return Promise.resolve(fixedColumnList);
					},
					getNotFixedColumnList: (
						info: Parameters<typeof getNotFixedColumnList>[0],
						categoryList: Parameters<typeof getNotFixedColumnList>[1],
					): Promise<TGet['data']['history']['notFixedList']> => {
						return Promise.resolve(notFixedColumnList);
					},
				},
			});

			try {
				const result = await injectedFunc({ accountBookId: 1 });

				equal(result.fixedIncomeList.length, 3);
				equal(result.fixedSpendingList.length, 1);
				equal(result.notFixedIncomeList[curDate.getDate() - 1].length, 1);
				equal(result.notFixedSpendingList[curDate.getDate() - 1].length, 1);
				equal(result.notFixedSpendingList[nextDate.getDate() - 1].length, 2);
				equal(result.notFixedIncomeList[nextDate.getDate() - 1].length, 0);
				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});
	});
});
