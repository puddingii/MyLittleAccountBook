/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, fail, ok } from 'assert';

import { errorUtil } from '../commonDependency';
import {
	getCategory,
	getNotFixedColumnList,
	getFixedColumnList,
} from '@/service/common/accountBook';

/** Model */
import GroupModel from '@/model/group';
import GroupAccountBookModel from '@/model/groupAccountBook';
import UserModel from '@/model/user';
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';

/** Interface */
import { TGet } from '@/interface/api/response/accountBookResponse';
import { TCategoryInfo } from '@/interface/model/categoryRepository';

export const testResult = {
	getCategory: (
		accountBookId: number,
		depth?: {
			start: number;
			end: number;
		},
	) => {
		return Promise.resolve([
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
			{
				parentId: 2,
				childId: 7,
				parentName: '부모2',
				categoryNamePath: '부모2 > 자식',
				categoryIdPath: '2 > 7',
			},
			{
				parentId: 2,
				childId: 8,
				parentName: '부모2',
				categoryNamePath: '부모2 > 자식22',
				categoryIdPath: '2 > 8',
			},
		]);
	},
	getFixedColumnList: (
		info: Parameters<ReturnType<typeof getFixedColumnList>>[0],
		categoryList: Parameters<ReturnType<typeof getFixedColumnList>>[1],
	): Promise<TGet['data']['history']['fixedList']> => {
		return Promise.resolve([
			{
				id: 1,
				gabId: 3,
				nickname: '사용자 닉네임',
				category: '부모 > 자식',
				type: 'income',
				cycleType: 'sd',
				cycleTime: 1,
				needToUpdateDate: new Date(),
				value: 3,
				content: '',
			},
			{
				id: 2,
				gabId: 5,
				nickname: '사용자 닉네임',
				category: '부모 > 자식22',
				type: 'spending',
				cycleType: 'd',
				cycleTime: 3,
				needToUpdateDate: new Date(),
				value: 30,
				content: 'a',
			},
		]);
	},
	getNotFixedColumnList: (
		info: Parameters<ReturnType<typeof getNotFixedColumnList>>[0],
		categoryList: Parameters<ReturnType<typeof getNotFixedColumnList>>[1],
	): Promise<TGet['data']['history']['notFixedList']> => {
		return Promise.resolve([
			{
				id: 1,
				gabId: 10,
				nickname: '사용자 닉네임',
				category: '부모 > 자식',
				type: 'income',
				spendingAndIncomeDate: new Date(),
				value: 3,
				content: '',
			},
			{
				id: 2,
				gabId: 11,
				nickname: '사용자 닉네임',
				category: '부모 > 자식2',
				type: 'spending',
				spendingAndIncomeDate: new Date(),
				value: 3,
				content: '',
			},
		]);
	},
};

describe('Common AccountBook Service Test', function () {
	const common = {
		errorUtil: { convertErrorToCustomError: errorUtil.convertErrorToCustomError },
	};

	describe('#getCategory', function () {
		it('Correct', async function () {
			const injectedFunc = getCategory({
				...common,
				repository: {
					findRecursiveCategoryList: (
						accountBookId: number,
						depth: {
							start: number;
							end: number;
						},
					) => {
						return Promise.resolve([
							{
								accountBookId: 1,
								categoryIdPath: '1 > 3',
								categoryNamePath: 'A > B',
								depth: 2,
								id: 5,
								name: 'B',
								parentId: 1,
							} as TCategoryInfo,
						]);
					},
				},
			});

			try {
				await injectedFunc(1, { end: 2, start: 2 });
				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check parent name', async function () {
			const injectedFunc = getCategory({
				...common,
				repository: {
					findRecursiveCategoryList: (
						accountBookId: number,
						depth: {
							start: number;
							end: number;
						},
					) => {
						return Promise.resolve([
							{
								accountBookId: 1,
								categoryIdPath: '1 > 3 > 5',
								categoryNamePath: 'A > B > D',
								depth: 3,
								id: 7,
								name: 'D',
								parentId: 1,
							},
							{
								accountBookId: 1,
								categoryIdPath: '1 > 3',
								categoryNamePath: 'A > B',
								depth: 2,
								id: 5,
								name: 'B',
								parentId: 1,
							},
							{
								accountBookId: 1,
								categoryIdPath: '4',
								categoryNamePath: 'C',
								depth: 1,
								id: 6,
								name: 'C',
							},
						]);
					},
				},
			});

			try {
				const result = await injectedFunc(1, { end: 3, start: 1 });
				equal(result[0].parentName, 'B');
				equal(result[1].parentName, 'A');
				equal(result[2].parentName, 'C');
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#getNotFixedColumnList', function () {
		const categoryList = [
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

		it('Check groupaccountbook', async function () {
			const gabInfo = {
				id: 1,
				groupId: 1,
				type: 'income' as const,
				spendingAndIncomeDate: new Date(),
				value: 122,
				content: 'asd',
				categoryId: 6,
			};
			const injectedFunc = getNotFixedColumnList({
				...common,
				repository: {
					findAllNotFixedColumn: (info: {
						accountBookId: number;
						startDate: Date;
						endDate: Date;
					}) => {
						const group = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});
						const gab = new GroupAccountBookModel(gabInfo);
						group.groupaccountbooks = [gab];

						return Promise.resolve([group]);
					},
				},
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				equal(result[0].id, 0);
				equal(result[0].gabId, gabInfo.id);
				equal(result[0].type, gabInfo.type);
				equal(result[0].spendingAndIncomeDate, gabInfo.spendingAndIncomeDate);
				equal(result[0].value, gabInfo.value);
				equal(result[0].content, gabInfo.content);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check category', async function () {
			const injectedFunc = getNotFixedColumnList({
				...common,
				repository: {
					findAllNotFixedColumn: (info: {
						accountBookId: number;
						startDate: Date;
						endDate: Date;
					}) => {
						const group = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});
						const gabInfo = new GroupAccountBookModel({
							id: 1,
							groupId: group.id,
							type: 'income',
							spendingAndIncomeDate: new Date(),
							value: 122,
							content: 'asd',
							categoryId: 6,
						});
						group.groupaccountbooks = [gabInfo];

						return Promise.resolve([group]);
					},
				},
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				equal(result[0].category, '부모 > 자식2');
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check user', async function () {
			const injectedFunc = getNotFixedColumnList({
				...common,
				repository: {
					findAllNotFixedColumn: (info: {
						accountBookId: number;
						startDate: Date;
						endDate: Date;
					}) => {
						const group = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});
						const group2 = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});
						const userInfo = new UserModel({
							email: 'test@naver.com',
							nickname: 'testNickname',
						});
						const userInfo2 = new UserModel({
							email: 'test@naver.com',
							nickname: 'testNickname2',
						});
						const gabInfo = new GroupAccountBookModel({
							id: 1,
							groupId: group.id,
							type: 'income',
							spendingAndIncomeDate: new Date(),
							value: 122,
							content: 'asd',
							categoryId: 6,
						});
						group.users = userInfo;
						group.groupaccountbooks = [gabInfo];
						group2.users = userInfo2;
						group2.groupaccountbooks = [gabInfo];

						return Promise.resolve([group, group2]);
					},
				},
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				equal(result[0].nickname, 'testNickname');
				equal(result[1].nickname, 'testNickname2');
			} catch (err) {
				fail(err as Error);
			}
		});
	});

	describe('#getFixedColumnList', function () {
		const categoryList = [
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
		const cgabInfo = {
			cycleTime: 1,
			cycleType: 'd' as const,
			needToUpdateDate: new Date(),
			type: 'income' as const,
			value: 22,
			content: '213',
			id: 3,
			categoryId: 6,
			groupId: 1,
			isActivated: true,
		};

		it('Check crongroupaccountbook', async function () {
			const injectedFunc = getFixedColumnList({
				...common,
				repository: {
					findAllFixedColumn: (info: {
						accountBookId: number;
						startDate?: Date;
						endDate?: Date;
					}) => {
						const group = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});
						const cgab = new CronGroupAccountBookModel(cgabInfo);
						group.crongroupaccountbooks = [cgab];

						return Promise.resolve([group]);
					},
				},
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				equal(result[0].id, 0);
				equal(result[0].content, cgabInfo.content);
				equal(result[0].cycleTime, cgabInfo.cycleTime);
				equal(result[0].cycleType, cgabInfo.cycleType);
				equal(result[0].gabId, cgabInfo.id);
				equal(result[0].needToUpdateDate, cgabInfo.needToUpdateDate);
				equal(result[0].value, cgabInfo.value);
				equal(result[0].type, cgabInfo.type);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check category', async function () {
			const injectedFunc = getFixedColumnList({
				...common,
				repository: {
					findAllFixedColumn: (info: {
						accountBookId: number;
						startDate?: Date;
						endDate?: Date;
					}) => {
						const group = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});
						const cgab = new CronGroupAccountBookModel(cgabInfo);
						group.crongroupaccountbooks = [cgab];

						return Promise.resolve([group]);
					},
				},
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				equal(result[0].category, '부모 > 자식2');
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check user', async function () {
			const injectedFunc = getFixedColumnList({
				...common,
				repository: {
					findAllFixedColumn: (info: {
						accountBookId: number;
						startDate?: Date;
						endDate?: Date;
					}) => {
						const group = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});
						const group2 = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});
						const userInfo = new UserModel({
							email: 'test@naver.com',
							nickname: 'testNickname',
						});
						const userInfo2 = new UserModel({
							email: 'test@naver.com',
							nickname: 'testNickname2',
						});
						const cgab = new CronGroupAccountBookModel(cgabInfo);
						group.users = userInfo;
						group.crongroupaccountbooks = [cgab];
						group2.users = userInfo2;
						group2.crongroupaccountbooks = [cgab];

						return Promise.resolve([group, group2]);
					},
				},
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				equal(result[0].nickname, 'testNickname');
				equal(result[1].nickname, 'testNickname2');
			} catch (err) {
				fail(err as Error);
			}
		});
	});
});
