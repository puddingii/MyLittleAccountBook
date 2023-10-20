/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, equal, fail, ok } from 'assert';
import sinon from 'sinon';

/** Service */
import { checkAdminGroupUser } from '@/service/common/user';

/** Dependency */
import { validationUtil } from '../commonDependency';
import { findGroup } from '@/repository/groupRepository/dependency';

/** Model */
import GroupModel from '@/model/group';

describe('Common AccountBook Service Test', function () {
	const { isAdminUserFalse, isAdminUserTrue } = validationUtil;

	describe('#checkAdminGroupUser', function () {
		const repository = { findGroup: findGroup };
		let stubFindGroup = sinon.stub(repository, 'findGroup');

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
		});

		it('Check function parameters', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			stubFindGroup.resolves(group);

			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});

				sinon.assert.calledWith(stubFindGroup, {
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			stubFindGroup.resolves(group);

			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserTrue },
				repository,
			});

			try {
				const result = await injectedFunc({
					accountBookId: 1,
					userEmail: 'test@naver.com',
				});

				equal(result, group);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If user is not admin user', async function () {
			const group = new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			});
			stubFindGroup.resolves(group);

			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserFalse },
				repository,
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
			stubFindGroup.resolves(null);

			const injectedFunc = checkAdminGroupUser({
				validationUtil: { isAdminUser: isAdminUserTrue },
				repository,
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
