/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, fail } from 'assert';
import sinon from 'sinon';

import dayjs from 'dayjs';
import { errorUtil } from '../commonDependency';
import { getDefaultInfo } from '@/service/thisMonthSummaryService';
import {
	getFixedColumnList,
	getNotFixedColumnList,
	getCategory,
} from '@/service/common/accountBook/dependency';

describe('ThisMonthSummary Service Test', function () {
	const common = {
		errorUtil: { convertErrorToCustomError: errorUtil.convertErrorToCustomError },
	};

	describe('#getDefaultInfo', function () {
		const service = { getCategory, getNotFixedColumnList, getFixedColumnList };
		let stubGetCategory = sinon.stub(service, 'getCategory');
		let stubGetNotFixedColumnList = sinon.stub(service, 'getNotFixedColumnList');
		let stubGetFixedColumnList = sinon.stub(service, 'getFixedColumnList');

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

		beforeEach(function () {
			stubGetCategory = sinon.stub(service, 'getCategory');
			stubGetNotFixedColumnList = sinon.stub(service, 'getNotFixedColumnList');
			stubGetFixedColumnList = sinon.stub(service, 'getFixedColumnList');
		});

		it('Check function parameters', async function () {
			stubGetCategory.resolves([...parentCategory]);
			stubGetNotFixedColumnList.resolves(notFixedColumnList);
			stubGetFixedColumnList.resolves(fixedColumnList);

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
				});
				const thisMonthInfo = {
					startDate: dayjs().startOf('month').toDate().toString(),
					endDate: dayjs().endOf('month').toDate().toString(),
				};

				sinon.assert.calledWith(stubGetCategory, 1, { start: 2, end: 2 });
				sinon.assert.calledWith(
					stubGetNotFixedColumnList,
					{ accountBookId: 1, ...thisMonthInfo },
					parentCategory,
				);
				sinon.assert.calledWith(
					stubGetFixedColumnList,
					{ accountBookId: 1, ...thisMonthInfo },
					parentCategory,
				);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check filtering', async function () {
			stubGetCategory.resolves([...parentCategory]);
			stubGetNotFixedColumnList.resolves(notFixedColumnList);
			stubGetFixedColumnList.resolves(fixedColumnList);

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				const result = await injectedFunc({ accountBookId: 1 });

				equal(result.fixedIncomeList.length, 3);
				equal(result.fixedSpendingList.length, 1);
				equal(result.notFixedIncomeList[curDate.getDate() - 1].length, 1);
				equal(result.notFixedSpendingList[curDate.getDate() - 1].length, 1);
				equal(result.notFixedSpendingList[nextDate.getDate() - 1].length, 2);
				equal(result.notFixedIncomeList[nextDate.getDate() - 1].length, 0);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If getCategory function throw error', async function () {
			const errorMessage = 'getCategory error';
			stubGetCategory.rejects(new Error(errorMessage));
			stubGetNotFixedColumnList.resolves(notFixedColumnList);
			stubGetFixedColumnList.resolves(fixedColumnList);

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				await injectedFunc({ accountBookId: 1 });
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					equal(err.message, errorMessage);
					sinon.assert.callCount(stubGetCategory, 1);
					sinon.assert.callCount(stubGetFixedColumnList, 0);
					sinon.assert.callCount(stubGetNotFixedColumnList, 0);
					return;
				}
				fail(err as Error);
			}
		});

		it('If getNotFixedColumnList function throw error', async function () {
			const errorMessage = 'getCategory error';
			stubGetCategory.resolves([...parentCategory]);
			stubGetNotFixedColumnList.rejects(new Error(errorMessage));
			stubGetFixedColumnList.resolves(fixedColumnList);

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				await injectedFunc({ accountBookId: 1 });
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					equal(err.message, errorMessage);
					sinon.assert.callCount(stubGetCategory, 1);
					sinon.assert.callCount(stubGetFixedColumnList, 0);
					sinon.assert.callCount(stubGetNotFixedColumnList, 1);
					return;
				}
				fail(err as Error);
			}
		});

		it('If getFixedColumnList function throw error', async function () {
			const errorMessage = 'getCategory error';
			stubGetCategory.resolves([...parentCategory]);
			stubGetNotFixedColumnList.resolves(notFixedColumnList);
			stubGetFixedColumnList.rejects(new Error(errorMessage));

			const injectedFunc = getDefaultInfo({
				...common,
				service,
			});

			try {
				await injectedFunc({ accountBookId: 1 });
			} catch (err) {
				if (err instanceof errorUtil.CustomError) {
					equal(err.message, errorMessage);
					sinon.assert.callCount(stubGetCategory, 1);
					sinon.assert.callCount(stubGetFixedColumnList, 1);
					sinon.assert.callCount(stubGetNotFixedColumnList, 1);
					return;
				}
				fail(err as Error);
			}
		});
	});
});
