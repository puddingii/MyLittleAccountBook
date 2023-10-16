/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, fail, ok } from 'assert';

import GroupModel from '@/model/group';
import { checkAdminGroupUser } from '@/service/common/user';
import { validationUtil } from '../commonDependency';

describe('Common AccountBook Service Test', function () {
	const { isAdminUserFalse, isAdminUserTrue } = validationUtil;
	describe('#checkAdminGroupUser', function () {
		it('Correct', async function () {
			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserTrue },
				repository: {
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) => {
						const group = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});

						return Promise.resolve(group);
					},
				},
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});
				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If user is not admin user', async function () {
			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserFalse },
				repository: {
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) => {
						const group = new GroupModel({
							id: 1,
							userEmail: 'test@naver.com',
							userType: 'owner',
							accountBookId: 1,
						});

						return Promise.resolve(group);
					},
				},
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});
				fail('Result is expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});

		it('If groupInfo is null', async function () {
			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserTrue },
				repository: {
					findGroup: (
						groupParams: Partial<{
							userEmail: string;
							accountBookId: number;
							id: number;
							userType: string;
							accessHistory: Date;
						}>,
					) => {
						return Promise.resolve(null);
					},
				},
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});
				fail('Result is expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err.message);
				}
				ok(true);
			}
		});
	});
});
