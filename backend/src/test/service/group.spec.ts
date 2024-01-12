/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepStrictEqual, equal, fail, ok } from 'assert';
import sinon from 'sinon';

/** Dependency */
import {
	createGroup,
	deleteGroup,
	findGroup,
	findGroupUserList,
	updateGroup,
} from '@/repository/groupRepository/dependency';
import { findUserInfo } from '@/repository/userRepository/dependency';
import { errorUtil, validationUtil } from '../commonDependency';
import {
	addGroup,
	deleteGroupUser,
	getGroupUserList,
	updateGroupInfo,
	validateGroupUser,
} from '@/service/groupService';

/** Model */
import GroupModel from '@/model/group';
import UserModel from '@/model/user';

describe('Group Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};

	describe('#validateGroupUser', function () {
		const repository = { findGroup };
		let stubFindGroup = sinon.stub(repository, 'findGroup');

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
		});

		it('Check function parameters', async function () {
			stubFindGroup.resolves(new GroupModel());

			const injectedFunc = validateGroupUser({ ...common, repository });

			try {
				await injectedFunc({ accountBookId: 1, myEmail: 'test@naver.com' });

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroup.resolves(new GroupModel());

			const injectedFunc = validateGroupUser({ ...common, repository });

			try {
				const result = await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
				});

				equal(result.isValid, true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup return null', async function () {
			stubFindGroup.resolves(null);

			const injectedFunc = validateGroupUser({ ...common, repository });

			try {
				const result = await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
				});

				equal(result.isValid, false);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup error', async function () {
			stubFindGroup.rejects(new Error('findGroup error'));

			const injectedFunc = validateGroupUser({ ...common, repository });

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
			}
		});
	});

	describe('#getGroupUserList', function () {
		const repository = { findGroupUserList };
		let stubFindGroupUserList = sinon.stub(repository, 'findGroupUserList');
		const groupList = [
			new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			}),
			new GroupModel({
				id: 2,
				userEmail: 'test2@naver.com',
				userType: 'observer',
				accountBookId: 1,
			}),
			new GroupModel({
				id: 3,
				userEmail: 'test3@naver.com',
				userType: 'writer',
				accountBookId: 1,
			}),
		];
		const joinedGroupList = [
			new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			}),
			new GroupModel({
				id: 2,
				userEmail: 'test2@naver.com',
				userType: 'observer',
				accountBookId: 1,
			}),
			new GroupModel({
				id: 3,
				userEmail: 'test3@naver.com',
				userType: 'writer',
				accountBookId: 1,
			}),
		];

		before(function () {
			joinedGroupList.map((group, idx) => {
				group.users = new UserModel({
					email: group.userEmail,
					nickname: `test${idx}`,
				});
				return group;
			});
		});

		beforeEach(function () {
			stubFindGroupUserList = sinon.stub(repository, 'findGroupUserList');
		});

		it('Check function parameters', async function () {
			stubFindGroupUserList.resolves(joinedGroupList);

			const injectedFunc = getGroupUserList({ ...common, repository });

			try {
				await injectedFunc({ accountBookId: 1 });

				sinon.assert.calledOnce(stubFindGroupUserList);
				sinon.assert.calledWith(stubFindGroupUserList, { accountBookId: 1 });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroupUserList.resolves(joinedGroupList);

			const injectedFunc = getGroupUserList({ ...common, repository });

			try {
				const result = await injectedFunc({ accountBookId: 1 });

				deepStrictEqual(result[0], {
					email: joinedGroupList[0].userEmail,
					id: joinedGroupList[0].id,
					type: joinedGroupList[0].userType,
					nickname: joinedGroupList[0].users?.nickname,
					index: 0,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check empty list', async function () {
			stubFindGroupUserList.resolves([]);

			const injectedFunc = getGroupUserList({ ...common, repository });

			try {
				const result = await injectedFunc({ accountBookId: 1 });

				equal(result.length, 0);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If DB join is ignored', async function () {
			stubFindGroupUserList.resolves(groupList);

			const injectedFunc = getGroupUserList({ ...common, repository });

			try {
				const result = await injectedFunc({ accountBookId: 1 });

				deepStrictEqual(result[0], {
					email: groupList[0].userEmail,
					id: groupList[0].id,
					type: groupList[0].userType,
					nickname: '',
					index: 0,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroupUserList error', async function () {
			stubFindGroupUserList.rejects(new Error('findGroupUserList error'));

			const injectedFunc = getGroupUserList({ ...common, repository });

			try {
				await injectedFunc({ accountBookId: 1 });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroupUserList);
			}
		});
	});

	describe('#addGroup', function () {
		const repository = { createGroup, findGroup, findUserInfo };
		let stubCreateGroup = sinon.stub(repository, 'createGroup');
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubFindUserInfo = sinon.stub(repository, 'findUserInfo');
		const invitedUserInfo: { userEmail: string; userType: GroupModel['userType'] } = {
			userEmail: 'test2@naver.com',
			userType: 'observer' as const,
		};

		beforeEach(function () {
			stubCreateGroup = sinon.stub(repository, 'createGroup');
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubFindUserInfo = sinon.stub(repository, 'findUserInfo');
		});

		it('Check function parameters', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			stubFindUserInfo.resolves(
				new UserModel({ email: 'test2@naver.com', nickname: 't' }),
			);

			const injectedFunc = addGroup({
				...common,
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfo);
				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubCreateGroup, {
					...invitedUserInfo,
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubFindUserInfo, { email: invitedUserInfo.userEmail });
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			stubFindUserInfo.resolves(
				new UserModel({ email: 'test2@naver.com', nickname: 't' }),
			);

			const injectedFunc = addGroup({
				...common,
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				const result = await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				deepStrictEqual(result, {
					email: invitedUserInfo.userEmail,
					type: invitedUserInfo.userType,
					id: 2,
					nickname: 't',
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup return null', async function () {
			stubFindGroup.resolves(null);
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			stubFindUserInfo.resolves(
				new UserModel({ email: 'test2@naver.com', nickname: 't' }),
			);

			const injectedFunc = addGroup({
				...common,
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubCreateGroup);
				sinon.assert.neverCalledWith(stubFindUserInfo);
			}
		});

		it('If findGroup return not administrator user', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'observer' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			stubFindUserInfo.resolves(
				new UserModel({ email: 'test2@naver.com', nickname: 't' }),
			);

			const injectedFunc = addGroup({
				...common,
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserFalse },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubCreateGroup);
				sinon.assert.neverCalledWith(stubFindUserInfo);
			}
		});

		it('If createGroup error', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.rejects(new Error('createGroup error'));
			stubFindUserInfo.resolves(
				new UserModel({ email: 'test2@naver.com', nickname: 't' }),
			);

			const injectedFunc = addGroup({
				...common,
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateGroup);
				sinon.assert.neverCalledWith(stubFindUserInfo);
			}
		});

		it('If findUserInfo return null', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			stubFindUserInfo.resolves(null);

			const injectedFunc = addGroup({
				...common,
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				const result = await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfo);
				equal(result.nickname, '');
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findUserInfo error', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			stubFindUserInfo.rejects(new Error('findUserInfo error'));

			const injectedFunc = addGroup({
				...common,
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfo);
			}
		});
	});

	describe('#updateGroupInfo', function () {
		const repository = { findGroup, updateGroup };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubUpdateGroup = sinon.stub(repository, 'updateGroup');
		const invitedUserInfo: { userEmail: string; userType: GroupModel['userType'] } = {
			userEmail: 'test2@naver.com',
			userType: 'observer' as const,
		};

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubUpdateGroup = sinon.stub(repository, 'updateGroup');
		});

		it('Check function parameters', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubUpdateGroup.resolves(1);

			const injectedFunc = updateGroupInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubUpdateGroup);
				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubUpdateGroup, {
					...invitedUserInfo,
					accountBookId: 1,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubUpdateGroup.resolves(1);

			const injectedFunc = updateGroupInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup return null', async function () {
			stubFindGroup.resolves(null);
			stubUpdateGroup.resolves(1);

			const injectedFunc = updateGroupInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubUpdateGroup);
			}
		});

		it('If findGroup return not administrator user', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'observer' }));
			stubUpdateGroup.resolves(1);

			const injectedFunc = updateGroupInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserFalse },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubUpdateGroup);
			}
		});

		it('If updateGroup return 0', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubUpdateGroup.resolves(0);

			const injectedFunc = updateGroupInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubUpdateGroup);
			}
		});

		it('If updateGroup error', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubUpdateGroup.rejects(new Error('updateGroup error'));

			const injectedFunc = updateGroupInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...invitedUserInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubUpdateGroup);
			}
		});
	});

	describe('#deleteGroupUser', function () {
		const repository = { findGroup, deleteGroup };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubDeleteGroupUser = sinon.stub(repository, 'deleteGroup');

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubDeleteGroupUser = sinon.stub(repository, 'deleteGroup');
		});

		it('Check function parameters', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubDeleteGroupUser.resolves(1);

			const injectedFunc = deleteGroupUser({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					id: 1,
				});

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubDeleteGroupUser);
				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubDeleteGroupUser, {
					id: 1,
					accountBookId: 1,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubDeleteGroupUser.resolves(1);

			const injectedFunc = deleteGroupUser({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					id: 1,
				});

				ok(true);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup return null', async function () {
			stubFindGroup.resolves(null);
			stubDeleteGroupUser.resolves(1);

			const injectedFunc = deleteGroupUser({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					id: 1,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubDeleteGroupUser);
			}
		});

		it('If findGroup return not administrator user', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'observer' }));
			stubDeleteGroupUser.resolves(1);

			const injectedFunc = deleteGroupUser({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserFalse },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					id: 1,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.neverCalledWith(stubDeleteGroupUser);
			}
		});

		it('If deleteGroup return 0', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubDeleteGroupUser.resolves(0);

			const injectedFunc = deleteGroupUser({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					id: 1,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubDeleteGroupUser);
			}
		});

		it('If deleteGroup error', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubDeleteGroupUser.rejects(new Error('deleteGroup error'));

			const injectedFunc = deleteGroupUser({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				repository,
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					id: 1,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubDeleteGroupUser);
			}
		});
	});
});
