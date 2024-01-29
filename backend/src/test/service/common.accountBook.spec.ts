/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepEqual, equal, fail } from 'assert';
import sinon from 'sinon';

/** Dependency */
import dateUtil from '@/util/date';
import { cacheUtil, errorUtil } from '../commonDependency';
import { findRecursiveCategoryList } from '@/repository/categoryRepository/dependency';
import { findAllNotFixedColumn } from '@/repository/groupAccountBookRepository/dependency';
import { findAllFixedColumnBasedGroup } from '@/repository/cronGroupAccountBookRepository/dependency';
import { findAllColumn } from '@/repository/groupRepository/dependency';

/** Service */
import {
	getCategory,
	getNotFixedColumnList,
	getFixedColumnList,
	getAllTypeColumnList,
} from '@/service/common/accountBook';

/** Model */
import GroupModel from '@/model/group';
import GroupAccountBookModel from '@/model/groupAccountBook';
import UserModel from '@/model/user';
import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';

/** Interface */
import { TGet } from '@/interface/api/response/accountBookResponse';
import { TCategoryInfo } from '@/interface/model/categoryRepository';
import { getRecursiveCategoryCache } from '@/util/cache/v2';

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
				needToUpdateDate: dateUtil.getCurrentDate(),
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
				needToUpdateDate: dateUtil.getCurrentDate(),
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
				spendingAndIncomeDate: dateUtil.getCurrentDate(),
				value: 3,
				content: '',
			},
			{
				id: 2,
				gabId: 11,
				nickname: '사용자 닉네임',
				category: '부모 > 자식2',
				type: 'spending',
				spendingAndIncomeDate: dateUtil.getCurrentDate(),
				value: 3,
				content: '',
			},
		]);
	},
};

describe('Common AccountBook Service Test', function () {
	const common = {
		errorUtil: { convertErrorToCustomError: errorUtil.convertErrorToCustomError },
		cacheUtil: { getCache: cacheUtil.getNullCache, setCache: cacheUtil.setCache },
		dateUtil,
	};

	describe('#getCategory', function () {
		const repository = { findRecursiveCategoryList };
		const customCacheUtil = {
			getCache: getRecursiveCategoryCache,
			setCache: cacheUtil.setCache,
		};
		let stubGetCache = sinon.stub(customCacheUtil, 'getCache');
		let stubFindRecursiveCategoryList: sinon.SinonStub<
			[
				accountBookId: number,
				depth: {
					start: number;
					end: number;
				},
			],
			Promise<TCategoryInfo[]>
		>;
		const findRecursiveDataList = [
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
		];
		const findRecursiveMappedDataList = [
			{
				parentName: 'B',
				parentId: 1,
				categoryIdPath: '1 > 3 > 5',
				categoryNamePath: 'A > B > D',
				childId: 7,
			},
			{
				parentName: 'A',
				parentId: 1,
				categoryIdPath: '1 > 3',
				categoryNamePath: 'A > B',
				childId: 5,
			},
			{
				parentName: 'C',
				parentId: undefined,
				categoryIdPath: '4',
				categoryNamePath: 'C',
				childId: 6,
			},
		];

		beforeEach(function () {
			stubFindRecursiveCategoryList = sinon.stub(repository, 'findRecursiveCategoryList');
			stubGetCache = sinon.stub(customCacheUtil, 'getCache');
		});

		it('Check function parameters', async function () {
			stubGetCache.resolves();
			stubFindRecursiveCategoryList.resolves([
				{
					accountBookId: 1,
					categoryIdPath: '1 > 3',
					categoryNamePath: 'A > B',
					depth: 2,
					id: 5,
					name: 'B',
					parentId: 1,
				},
			]);

			const injectedFunc = getCategory({
				...common,
				cacheUtil: customCacheUtil,
				repository,
			});

			try {
				await injectedFunc(1, { end: 2, start: 2 });

				sinon.assert.calledWith(stubGetCache, '1');
				sinon.assert.calledWith(stubFindRecursiveCategoryList, 1);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubGetCache.resolves();
			stubFindRecursiveCategoryList.resolves(findRecursiveDataList);

			const injectedFunc = getCategory({
				...common,
				cacheUtil: customCacheUtil,
				repository,
			});

			try {
				const result = await injectedFunc(1, { end: 3, start: 1 });

				deepEqual(result, findRecursiveMappedDataList);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If cache data is existed', async function () {
			stubGetCache.resolves(JSON.stringify(findRecursiveMappedDataList));
			stubFindRecursiveCategoryList.resolves(findRecursiveDataList);

			const injectedFunc = getCategory({
				...common,
				cacheUtil: customCacheUtil,
				repository,
			});

			try {
				await injectedFunc(1, { end: 3, start: 1 });

				sinon.assert.calledOnce(stubGetCache);
				sinon.assert.notCalled(stubFindRecursiveCategoryList);
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
		const gabInfo = {
			id: 1,
			groupId: 1,
			type: 'income' as const,
			spendingAndIncomeDate: dateUtil.getCurrentDate(),
			value: 122,
			content: 'asd',
			categoryId: 6,
		};
		const repository = { findAllNotFixedColumn };
		let stubFindAllNotFixedColumn = sinon.stub(repository, 'findAllNotFixedColumn');

		beforeEach(function () {
			stubFindAllNotFixedColumn = sinon.stub(repository, 'findAllNotFixedColumn');
		});

		it('Check function parameters', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const gab = new GroupAccountBookModel(gabInfo);
			group.groupaccountbooks = [gab];

			stubFindAllNotFixedColumn.resolves([group]);

			const injectedFunc = getNotFixedColumnList({
				...common,
				repository,
			});

			try {
				const info = { accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' };
				await injectedFunc(info, categoryList);

				sinon.assert.calledWith(stubFindAllNotFixedColumn, {
					accountBookId: info.accountBookId,
					endDate: dateUtil.toDate(info.endDate),
					startDate: dateUtil.toDate(info.startDate),
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findAllNotFixedColumn error', async function () {
			stubFindAllNotFixedColumn.rejects(new Error('FindAllNotFixedColumn error'));

			const injectedFunc = getNotFixedColumnList({
				...common,
				repository,
			});

			try {
				await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err as Error);
				}
				sinon.assert.calledOnce(stubFindAllNotFixedColumn);
			}
		});

		it('Check correct groupaccountbook', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const gab = new GroupAccountBookModel(gabInfo);
			group.groupaccountbooks = [gab];

			stubFindAllNotFixedColumn.resolves([group]);

			const injectedFunc = getNotFixedColumnList({
				...common,
				repository,
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
			const group = new GroupModel({
				id: gabInfo.groupId,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const gab = new GroupAccountBookModel(gabInfo);
			group.groupaccountbooks = [gab];

			stubFindAllNotFixedColumn.resolves([group]);

			const injectedFunc = getNotFixedColumnList({
				...common,
				repository,
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
			const group = new GroupModel({
				id: gabInfo.groupId,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const group2 = new GroupModel({
				id: 2,
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
			const gab = new GroupAccountBookModel(gabInfo);
			group.users = userInfo;
			group.groupaccountbooks = [gab];
			group2.users = userInfo2;
			group2.groupaccountbooks = [gab];

			stubFindAllNotFixedColumn.resolves([group, group2]);

			const injectedFunc = getNotFixedColumnList({
				...common,
				repository,
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
			needToUpdateDate: dateUtil.getCurrentDate(),
			type: 'income' as const,
			value: 22,
			content: '213',
			id: 3,
			categoryId: 6,
			groupId: 1,
			isActivated: true,
		};

		const repository = { findAllFixedColumnBasedGroup };
		let stubFindAllFixedColumnBasedGroup = sinon.stub(
			repository,
			'findAllFixedColumnBasedGroup',
		);

		beforeEach(function () {
			stubFindAllFixedColumnBasedGroup = sinon.stub(
				repository,
				'findAllFixedColumnBasedGroup',
			);
		});

		it('Check function parameters', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const cgab = new CronGroupAccountBookModel(cgabInfo);
			group.crongroupaccountbooks = [cgab];

			stubFindAllFixedColumnBasedGroup.resolves([group]);

			const injectedFunc = getFixedColumnList({
				...common,
				repository,
			});

			try {
				const info = { accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' };
				await injectedFunc(info, categoryList);

				sinon.assert.calledWith(stubFindAllFixedColumnBasedGroup, {
					accountBookId: info.accountBookId,
					endDate: dateUtil.toDate(info.endDate),
					startDate: dateUtil.toDate(info.startDate),
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check function parameters(startDate or endDate)', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const cgab = new CronGroupAccountBookModel(cgabInfo);
			group.crongroupaccountbooks = [cgab];

			stubFindAllFixedColumnBasedGroup.resolves([group]);

			const injectedFunc = getFixedColumnList({
				...common,
				repository,
			});

			try {
				const info = { accountBookId: 1, endDate: '2022-02-03' };
				await injectedFunc(info, categoryList);

				sinon.assert.calledWith(stubFindAllFixedColumnBasedGroup, {
					accountBookId: info.accountBookId,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findAllFixedColumnBasedGroup error', async function () {
			stubFindAllFixedColumnBasedGroup.rejects(
				new Error('findAllFixedColumnBasedGroup error'),
			);

			const injectedFunc = getFixedColumnList({
				...common,
				repository,
			});

			try {
				const info = { accountBookId: 1, endDate: '2022-02-03' };
				await injectedFunc(info, categoryList);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindAllFixedColumnBasedGroup);
			}
		});

		it('Check crongroupaccountbook', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const cgab = new CronGroupAccountBookModel(cgabInfo);
			group.crongroupaccountbooks = [cgab];

			stubFindAllFixedColumnBasedGroup.resolves([group]);

			const injectedFunc = getFixedColumnList({
				...common,
				repository,
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
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const cgab = new CronGroupAccountBookModel(cgabInfo);
			group.crongroupaccountbooks = [cgab];

			stubFindAllFixedColumnBasedGroup.resolves([group]);

			const injectedFunc = getFixedColumnList({
				...common,
				repository,
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

			stubFindAllFixedColumnBasedGroup.resolves([group, group2]);

			const injectedFunc = getFixedColumnList({
				...common,
				repository,
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

	describe('#getAllTypeColumnList', function () {
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
			needToUpdateDate: dateUtil.getCurrentDate(),
			type: 'income' as const,
			value: 22,
			content: '213',
			id: 3,
			categoryId: 6,
			groupId: 1,
			isActivated: true,
		};
		const gabInfo = {
			id: 1,
			groupId: 1,
			type: 'income' as const,
			spendingAndIncomeDate: dateUtil.getCurrentDate(),
			value: 122,
			content: 'asd',
			categoryId: 6,
		};

		const repository = { findAllColumn };
		let stubFindAllColumn = sinon.stub(repository, 'findAllColumn');

		beforeEach(function () {
			stubFindAllColumn = sinon.stub(repository, 'findAllColumn');
		});

		it('Check function parameters', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const cgab = new CronGroupAccountBookModel(cgabInfo);
			group.crongroupaccountbooks = [cgab];
			const gab = new GroupAccountBookModel(gabInfo);
			group.groupaccountbooks = [gab];

			stubFindAllColumn.resolves([group]);

			const injectedFunc = getAllTypeColumnList({
				...common,
				repository,
			});

			try {
				const info = { accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' };
				await injectedFunc(info, categoryList);

				sinon.assert.calledWith(stubFindAllColumn, {
					accountBookId: info.accountBookId,
					endDate: dateUtil.toDate(info.endDate),
					startDate: dateUtil.toDate(info.startDate),
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check function parameters(startDate or endDate)', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const cgab = new CronGroupAccountBookModel(cgabInfo);
			group.crongroupaccountbooks = [cgab];
			const gab = new GroupAccountBookModel(gabInfo);
			group.groupaccountbooks = [gab];

			stubFindAllColumn.resolves([group]);

			const injectedFunc = getAllTypeColumnList({
				...common,
				repository,
			});

			try {
				const info = { accountBookId: 1, endDate: '2022-02-03' };
				await injectedFunc(info, categoryList);

				sinon.assert.calledWith(stubFindAllColumn, {
					accountBookId: info.accountBookId,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findAllFixedColumnBasedGroup error', async function () {
			stubFindAllColumn.rejects(new Error('findAllFixedColumnBasedGroup error'));

			const injectedFunc = getAllTypeColumnList({
				...common,
				repository,
			});

			try {
				const info = { accountBookId: 1, endDate: '2022-02-03' };
				await injectedFunc(info, categoryList);

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindAllColumn);
			}
		});

		it('Check crongroupaccountbook, groupaccountbook', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const cgab = new CronGroupAccountBookModel(cgabInfo);
			group.crongroupaccountbooks = [cgab];
			const gab = new GroupAccountBookModel(gabInfo);
			group.groupaccountbooks = [gab];

			stubFindAllColumn.resolves([group]);

			const injectedFunc = getAllTypeColumnList({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				const fResult = result.fgab;
				const nfResult = result.nfgab;

				equal(fResult[0].id, 0);
				equal(fResult[0].content, cgabInfo.content);
				equal(fResult[0].cycleTime, cgabInfo.cycleTime);
				equal(fResult[0].cycleType, cgabInfo.cycleType);
				equal(fResult[0].gabId, cgabInfo.id);
				equal(fResult[0].needToUpdateDate, cgabInfo.needToUpdateDate);
				equal(fResult[0].value, cgabInfo.value);
				equal(fResult[0].type, cgabInfo.type);

				equal(nfResult[0].id, 0);
				equal(nfResult[0].gabId, gabInfo.id);
				equal(nfResult[0].type, gabInfo.type);
				equal(nfResult[0].spendingAndIncomeDate, gabInfo.spendingAndIncomeDate);
				equal(nfResult[0].value, gabInfo.value);
				equal(nfResult[0].content, gabInfo.content);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check category', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			const cgab = new CronGroupAccountBookModel(cgabInfo);
			group.crongroupaccountbooks = [cgab];
			const gab = new GroupAccountBookModel(gabInfo);
			group.groupaccountbooks = [gab];

			stubFindAllColumn.resolves([group]);

			const injectedFunc = getAllTypeColumnList({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				const fResult = result.fgab;
				const nfResult = result.nfgab;

				equal(fResult[0].category, '부모 > 자식2');
				equal(nfResult[0].category, '부모 > 자식2');
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check user', async function () {
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
			const gab = new GroupAccountBookModel(gabInfo);
			group.users = userInfo;
			group.crongroupaccountbooks = [cgab];
			group.groupaccountbooks = [gab];
			group2.users = userInfo2;
			group2.crongroupaccountbooks = [cgab];
			group2.groupaccountbooks = [gab];

			stubFindAllColumn.resolves([group, group2]);

			const injectedFunc = getAllTypeColumnList({
				...common,
				repository,
			});

			try {
				const result = await injectedFunc(
					{ accountBookId: 1, endDate: '2022-02-03', startDate: '2022-02-01' },
					categoryList,
				);

				const fResult = result.fgab;
				const nfResult = result.nfgab;

				equal(fResult[0].nickname, 'testNickname');
				equal(fResult[1].nickname, 'testNickname2');
				equal(nfResult[0].nickname, 'testNickname');
				equal(nfResult[1].nickname, 'testNickname2');
			} catch (err) {
				fail(err as Error);
			}
		});
	});
});
