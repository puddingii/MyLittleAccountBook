/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepStrictEqual, equal, fail, ok } from 'assert';
import sinon from 'sinon';

/** Dependency */
import {
	createGroup,
	deleteGroup,
	findGroup,
	findGroupAccountBookList,
	findGroupUserList,
	updateGroup,
} from '@/repository/groupRepository/dependency';
import { findUserInfoWithPrivacy } from '@/repository/userRepository/dependency';
import { errorUtil, validationUtil } from '../commonDependency';
import {
	addGroup,
	deleteGroupUser,
	getGroupAccountBookList,
	getGroupUserList,
	updateGroupInfo,
	validateGroupUser,
} from '@/service/groupService';

/** Model */
import GroupModel from '@/model/group';
import UserModel from '@/model/user';
import UserPrivacyModel from '@/model/userPrivacy';
import AccountBookModel from '@/model/accountBook';

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

	describe('#getGroupAccountBookList', function () {
		const repository = { findGroupAccountBookList };
		let stubFindGroupAccountBookList = sinon.stub(repository, 'findGroupAccountBookList');
		const groupList = [
			new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
				accountBookId: 1,
			}),
			new GroupModel({
				id: 2,
				userEmail: 'test@naver.com',
				userType: 'observer',
				accountBookId: 2,
			}),
			new GroupModel({
				id: 3,
				userEmail: 'test@naver.com',
				userType: 'writer',
				accountBookId: 3,
			}),
		];
		const joinedGroupList = [
			new GroupModel({
				id: 1,
				userEmail: 'test@naver.com',
				userType: 'owner',
			}),
			new GroupModel({
				id: 2,
				userEmail: 'test@naver.com',
				userType: 'observer',
			}),
			new GroupModel({
				id: 3,
				userEmail: 'test@naver.com',
				userType: 'writer',
			}),
		];
		const mixedGroupList = [...groupList, ...joinedGroupList];

		before(function () {
			joinedGroupList.map((group, idx) => {
				group.accountbooks = new AccountBookModel({
					title: `title${idx}`,
					content: `content${idx}`,
					id: idx + 1,
				});
				group.accountBookId = idx + 1;
				return group;
			});
		});

		beforeEach(function () {
			stubFindGroupAccountBookList = sinon.stub(repository, 'findGroupAccountBookList');
		});

		it('Check function parameters', async function () {
			stubFindGroupAccountBookList.resolves(joinedGroupList);

			const injectedFunc = getGroupAccountBookList({ ...common, repository });

			try {
				await injectedFunc({ userEmail: 'test@naver.com' });

				sinon.assert.calledWith(stubFindGroupAccountBookList, {
					userEmail: 'test@naver.com',
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroupAccountBookList.resolves(joinedGroupList);

			const injectedFunc = getGroupAccountBookList({ ...common, repository });

			try {
				const result = await injectedFunc({ userEmail: 'test@naver.com' });

				deepStrictEqual(result[0], {
					accountBookId: joinedGroupList[0]?.accountbooks?.id,
					accountBookName: joinedGroupList[0]?.accountbooks?.title,
					accountBookContent: joinedGroupList[0]?.accountbooks?.content,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check empty list', async function () {
			stubFindGroupAccountBookList.resolves([]);

			const injectedFunc = getGroupAccountBookList({ ...common, repository });

			try {
				const result = await injectedFunc({ userEmail: 'test@naver.com' });

				equal(result.length, 0);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check mixed list(joined, not joined)', async function () {
			stubFindGroupAccountBookList.resolves(mixedGroupList);

			const injectedFunc = getGroupAccountBookList({ ...common, repository });

			try {
				const result = await injectedFunc({ userEmail: 'test@naver.com' });

				equal(result.length, 3);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If DB join is ignored', async function () {
			stubFindGroupAccountBookList.resolves(groupList);

			const injectedFunc = getGroupAccountBookList({ ...common, repository });

			try {
				const result = await injectedFunc({ userEmail: 'test@naver.com' });

				deepStrictEqual(result.length, 0);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroupUserList error', async function () {
			stubFindGroupAccountBookList.rejects(new Error('findGroupUserList error'));

			const injectedFunc = getGroupAccountBookList({ ...common, repository });

			try {
				await injectedFunc({ userEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroupAccountBookList);
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
		const repository = { createGroup, findGroup, findUserInfoWithPrivacy };
		let stubCreateGroup = sinon.stub(repository, 'createGroup');
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubFindUserInfoWithPrivacy = sinon.stub(repository, 'findUserInfoWithPrivacy');
		const invitedUserInfo: { userEmail: string; userType: GroupModel['userType'] } = {
			userEmail: 'test2@naver.com',
			userType: 'observer' as const,
		};
		const admin = { email: 'test2@naver.com', nickname: 't' };
		const userPrivacyInfo = {
			auth: {
				isAuthenticated: true,
				isGroupInvitationOn: false,
				isPublicUser: false,
			},
			group: {
				isAuthenticated: false,
				isGroupInvitationOn: true,
				isPublicUser: false,
			},
			public: {
				isAuthenticated: false,
				isGroupInvitationOn: false,
				isPublicUser: true,
			},
			authGroup: {
				isAuthenticated: true,
				isGroupInvitationOn: true,
				isPublicUser: false,
			},
			authPublic: {
				isAuthenticated: true,
				isGroupInvitationOn: false,
				isPublicUser: true,
			},
			groupPublic: {
				isAuthenticated: false,
				isGroupInvitationOn: true,
				isPublicUser: true,
			},
			authGroupPublic: {
				isAuthenticated: true,
				isGroupInvitationOn: true,
				isPublicUser: true,
			},
		};

		beforeEach(function () {
			stubCreateGroup = sinon.stub(repository, 'createGroup');
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubFindUserInfoWithPrivacy = sinon.stub(repository, 'findUserInfoWithPrivacy');
		});

		it('Check function parameters', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			const user = new UserModel(admin);
			const userPrivacy = new UserPrivacyModel({
				userEmail: admin.email,
				...userPrivacyInfo.authGroupPublic,
			});
			user.userprivacy = userPrivacy;
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
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
				sinon.assert.calledOnce(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfoWithPrivacy);
				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubCreateGroup, {
					...invitedUserInfo,
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubFindUserInfoWithPrivacy, {
					email: invitedUserInfo.userEmail,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			const user = new UserModel(admin);
			const userPrivacy = new UserPrivacyModel({
				userEmail: admin.email,
				...userPrivacyInfo.authGroupPublic,
			});
			user.userprivacy = userPrivacy;
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
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
			const user = new UserModel(admin);
			const userPrivacy = new UserPrivacyModel({
				userEmail: admin.email,
				...userPrivacyInfo.authGroupPublic,
			});
			user.userprivacy = userPrivacy;
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
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
				sinon.assert.notCalled(stubCreateGroup);
				sinon.assert.notCalled(stubFindUserInfoWithPrivacy);
			}
		});

		it('If findGroup return not administrator user', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'observer' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			const user = new UserModel(admin);
			const userPrivacy = new UserPrivacyModel({
				userEmail: admin.email,
				...userPrivacyInfo.authGroupPublic,
			});
			user.userprivacy = userPrivacy;
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
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
				sinon.assert.notCalled(stubCreateGroup);
				sinon.assert.notCalled(stubFindUserInfoWithPrivacy);
			}
		});

		it('If createGroup error', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.rejects(new Error('createGroup error'));
			const user = new UserModel(admin);
			const userPrivacy = new UserPrivacyModel({
				userEmail: admin.email,
				...userPrivacyInfo.authGroupPublic,
			});
			user.userprivacy = userPrivacy;
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
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
				sinon.assert.calledOnce(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfoWithPrivacy);
			}
		});

		it('If findUserInfoWithPrivacy return null', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			stubFindUserInfoWithPrivacy.resolves(null);

			const injectedFunc = addGroup({
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
				sinon.assert.notCalled(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfoWithPrivacy);
			}
		});

		it('If findUserInfoWithPrivacy error', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			stubFindUserInfoWithPrivacy.rejects(new Error('findUserInfoWithPrivacy error'));

			const injectedFunc = addGroup({
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
				sinon.assert.notCalled(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfoWithPrivacy);
			}
		});

		it('If userprivacy join error', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			const user = new UserModel(admin);
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
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
				sinon.assert.notCalled(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfoWithPrivacy);
			}
		});

		it('If isAuthenticated privacy is false', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			const user = new UserModel(admin);
			const userPrivacy = new UserPrivacyModel({
				userEmail: admin.email,
				...userPrivacyInfo.authGroupPublic,
				isAuthenticated: false,
			});
			user.userprivacy = userPrivacy;
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
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
				sinon.assert.notCalled(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfoWithPrivacy);
			}
		});

		it('If isPublicUser privacy is false', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			const user = new UserModel(admin);
			const userPrivacy = new UserPrivacyModel({
				userEmail: admin.email,
				...userPrivacyInfo.authGroupPublic,
				isPublicUser: false,
			});
			user.userprivacy = userPrivacy;
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
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
				sinon.assert.notCalled(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfoWithPrivacy);
			}
		});

		it('If isGroupInvitationOn privacy is false', async function () {
			stubFindGroup.resolves(new GroupModel({ userEmail: '', userType: 'owner' }));
			stubCreateGroup.resolves(new GroupModel({ ...invitedUserInfo, id: 2 }));
			const user = new UserModel(admin);
			const userPrivacy = new UserPrivacyModel({
				userEmail: admin.email,
				...userPrivacyInfo.authGroupPublic,
				isGroupInvitationOn: false,
			});
			user.userprivacy = userPrivacy;
			stubFindUserInfoWithPrivacy.resolves(user);

			const injectedFunc = addGroup({
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
				sinon.assert.notCalled(stubCreateGroup);
				sinon.assert.calledOnce(stubFindUserInfoWithPrivacy);
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
				sinon.assert.notCalled(stubUpdateGroup);
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
				sinon.assert.notCalled(stubUpdateGroup);
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
				sinon.assert.notCalled(stubDeleteGroupUser);
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
				sinon.assert.notCalled(stubDeleteGroupUser);
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
