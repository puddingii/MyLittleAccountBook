/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssertionError, deepEqual, fail } from 'assert';
import sinon from 'sinon';
import { Readable } from 'stream';

/** Service */
import {
	getAccountBookInfo,
	updateAccountBookImageInfo,
	updateAccountBookInfo,
} from '@/service/manageAccountBook';

/** Dependency */
import {
	findOneAccountBookWithImage,
	updateAccountBook,
} from '@/repository/accountBookRepository/dependency';
import {
	findGroup,
	findGroupWithAccountBookMedia,
} from '@/repository/groupRepository/dependency';
import {
	createAccountBookMedia,
	updateAccountBookMedia,
} from '@/repository/accountBookMediaRepository/dependency';
import { errorUtil, validationUtil } from '../commonDependency';
import { getRandomString } from '@/util/string';

/** Model */
import AccountBookModel from '@/model/accountBook';
import GroupModel from '@/model/group';
import AccountBookMediaModel from '@/model/accountBookMedia';
import eventEmitter from '@/pubsub/imagePubsub';

describe('ManageAccountBook Service Test', function () {
	const common = {
		errorUtil: {
			convertErrorToCustomError: errorUtil.convertErrorToCustomError,
		},
	};

	describe('#getAccountBookInfo', function () {
		const repository = { findGroup, findOneAccountBookWithImage };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubFindOneAccountBookWithImage = sinon.stub(
			repository,
			'findOneAccountBookWithImage',
		);

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubFindOneAccountBookWithImage = sinon.stub(
				repository,
				'findOneAccountBookWithImage',
			);
		});

		it('Check function parameters', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			const medaiInfo = {
				isSaved: true,
				mimeType: 'image/jpeg',
				name: 'testimage',
				path: 'testpath/image',
				size: 10010,
				id: 1,
			};
			stubFindGroup.resolves(new GroupModel());
			const abm = new AccountBookModel(accountBookInfo);
			const image = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: abm.id,
				id: 1,
			});
			abm.accountbookmedias = image;
			stubFindOneAccountBookWithImage.resolves(abm);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com', id: 1, title: '가계부 이름' });

				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubFindOneAccountBookWithImage, {
					id: 1,
					title: '가계부 이름',
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			stubFindGroup.resolves(new GroupModel());
			const path = 'testpath';
			const medaiInfo = {
				isSaved: true,
				mimeType: 'image/jpeg',
				name: 'testimage',
				path: `${path}/image`,
				size: 10010,
				id: 1,
			};
			const abm = new AccountBookModel(accountBookInfo);
			const image = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: abm.id,
				id: 1,
			});
			abm.accountbookmedias = image;
			stubFindOneAccountBookWithImage.resolves(abm);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				const result = await injectedFunc({ myEmail: 'test@naver.com' });

				deepEqual(result, {
					title: accountBookInfo.title,
					content: accountBookInfo.content,
					imagePath: `image/${path}/${medaiInfo.name}`,
				});
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubFindOneAccountBookWithImage);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup is null', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			stubFindGroup.resolves(null);
			const medaiInfo = {
				isSaved: true,
				mimeType: 'image/jpeg',
				name: 'testimage',
				path: 'testpath/image',
				size: 10010,
				id: 1,
			};
			const abm = new AccountBookModel(accountBookInfo);
			const image = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: abm.id,
				id: 1,
			});
			abm.accountbookmedias = image;
			stubFindOneAccountBookWithImage.resolves(abm);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubFindOneAccountBookWithImage);
			}
		});

		it('If findOneAccountBook is null', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubFindOneAccountBookWithImage.resolves(null);

			const injectedFunc = getAccountBookInfo({ ...common, repository });

			try {
				await injectedFunc({ myEmail: 'test@naver.com' });

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubFindOneAccountBookWithImage);
			}
		});
	});

	describe('#updateAccountBookInfo', function () {
		const repository = { findGroup, updateAccountBook };
		let stubFindGroup = sinon.stub(repository, 'findGroup');
		let stubUpdateAccountBook = sinon.stub(repository, 'updateAccountBook');

		beforeEach(function () {
			stubFindGroup = sinon.stub(repository, 'findGroup');
			stubUpdateAccountBook = sinon.stub(repository, 'updateAccountBook');
		});

		it('Check function parameters', async function () {
			const accountBookInfo = {
				title: '가계부 이름',
				content: '가계부 설명',
			};
			stubFindGroup.resolves(new GroupModel());
			stubUpdateAccountBook.resolves(1);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					...accountBookInfo,
				});

				sinon.assert.calledWith(stubFindGroup, {
					userEmail: 'test@naver.com',
					accountBookId: 1,
				});
				sinon.assert.calledWith(stubUpdateAccountBook, {
					...accountBookInfo,
					accountBookId: 1,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubUpdateAccountBook.resolves(1);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					title: '가계부 이름',
					content: '가계부 설명',
				});

				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubUpdateAccountBook);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If findGroup is null', async function () {
			stubFindGroup.resolves(null);
			stubUpdateAccountBook.resolves(1);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					title: '가계부 이름',
					content: '가계부 설명',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubUpdateAccountBook);
			}
		});

		it('If isAdminUser is false', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubUpdateAccountBook.resolves(1);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserFalse },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					title: '가계부 이름',
					content: '가계부 설명',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.notCalled(stubUpdateAccountBook);
			}
		});

		it('If updateAccountBook is 0', async function () {
			stubFindGroup.resolves(new GroupModel());
			stubUpdateAccountBook.resolves(0);

			const injectedFunc = updateAccountBookInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				repository,
			});

			try {
				await injectedFunc({
					accountBookId: 1,
					myEmail: 'test@naver.com',
					title: '가계부 이름',
					content: '가계부 설명',
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroup);
				sinon.assert.calledOnce(stubUpdateAccountBook);
			}
		});
	});

	describe('#updateAccountBookImageInfo', function () {
		const repository = {
			findGroupWithAccountBookMedia,
			updateAccountBookMedia,
			createAccountBookMedia,
		};
		const stringUtil = {
			getRandomString,
		};
		const fileInfo = {
			path: 'testpath/image',
			nameLength: 10,
		};
		let stubEventEmitter = sinon.stub(eventEmitter, 'emit');
		let stubFindGroupWithAccountBookMedia = sinon.stub(
			repository,
			'findGroupWithAccountBookMedia',
		);
		let stubUpdateAccountBookMedia = sinon.stub(repository, 'updateAccountBookMedia');
		let stubCreateAccountBookMedia = sinon.stub(repository, 'createAccountBookMedia');
		let stubGetRandomString = sinon.stub(stringUtil, 'getRandomString');

		const randomString = 'asdfqwerzx';
		const testfile = {
			mimeType: 'image/jpeg',
			name: 'testname',
			size: 1024,
			stream: new Readable(),
			encoding: 'jpeg',
			filename: 'testfilename',
			buffer: Buffer.from([]),
		};
		const medaiInfo = {
			isSaved: true,
			mimeType: testfile.mimeType,
			name: testfile.filename,
			path: 'testpath/image',
			size: testfile.size,
			id: 1,
		};
		const userInfo = {
			myEmail: 'test@naver.com',
			accountBookId: 1,
		};

		beforeEach(function () {
			stubFindGroupWithAccountBookMedia = sinon.stub(
				repository,
				'findGroupWithAccountBookMedia',
			);
			stubUpdateAccountBookMedia = sinon.stub(repository, 'updateAccountBookMedia');
			stubCreateAccountBookMedia = sinon.stub(repository, 'createAccountBookMedia');
			stubGetRandomString = sinon.stub(stringUtil, 'getRandomString');
			stubEventEmitter = sinon.stub(eventEmitter, 'emit');
		});

		it('Check function parameters(If abm is existed)', async function () {
			const g = new GroupModel({
				userEmail: userInfo.myEmail,
				userType: 'owner' as const,
				accountBookId: userInfo.accountBookId,
			});
			const abm = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: g.id,
				id: 1,
			});
			const updatedMediaInfo = {
				isSaved: false,
				accountBookId: userInfo.accountBookId,
				name: randomString,
				id: abm.id,
				mimeType: testfile.mimeType,
				size: testfile.size,
				path: medaiInfo.path,
			};
			g.accountbookmedias = abm;
			stubFindGroupWithAccountBookMedia.resolves(g);
			stubUpdateAccountBookMedia.resolves(1);
			stubCreateAccountBookMedia.resolves(
				new AccountBookMediaModel({
					...updatedMediaInfo,
					id: 1,
				}),
			);
			stubGetRandomString.resolves(randomString);
			stubEventEmitter.returns(undefined);

			const injectedFunc = updateAccountBookImageInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				fileInfo,
				stringUtil,
				eventEmitter,
				repository,
			});

			try {
				await injectedFunc({
					file: testfile,
					...userInfo,
				});

				sinon.assert.calledWith(stubFindGroupWithAccountBookMedia, {
					userEmail: userInfo.myEmail,
					accountBookId: userInfo.accountBookId,
				});
				sinon.assert.calledWith(stubUpdateAccountBookMedia, {
					...updatedMediaInfo,
					id: 1,
				});
				sinon.assert.calledWith(stubGetRandomString, fileInfo.nameLength, '.jpeg');
				sinon.assert.calledWith(stubEventEmitter, 'upload', {
					name: randomString,
					path: medaiInfo.path,
					buffer: testfile.buffer,
					id: abm.id,
					beforeName: medaiInfo.name,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result(If abm is existed)', async function () {
			const g = new GroupModel({
				userEmail: userInfo.myEmail,
				userType: 'owner' as const,
				accountBookId: userInfo.accountBookId,
			});
			const abm = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: g.id,
				id: 1,
			});
			const updatedMediaInfo = {
				isSaved: false,
				accountBookId: userInfo.accountBookId,
				name: randomString,
				id: abm.id,
				mimeType: testfile.mimeType,
				size: testfile.size,
				path: medaiInfo.path,
			};
			g.accountbookmedias = abm;
			stubFindGroupWithAccountBookMedia.resolves(g);
			stubUpdateAccountBookMedia.resolves(1);
			stubCreateAccountBookMedia.resolves(
				new AccountBookMediaModel({
					...updatedMediaInfo,
					id: 1,
				}),
			);
			stubGetRandomString.resolves(randomString);
			stubEventEmitter.returns(undefined);

			const injectedFunc = updateAccountBookImageInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				fileInfo,
				stringUtil,
				eventEmitter,
				repository,
			});

			try {
				const result = await injectedFunc({
					file: testfile,
					...userInfo,
				});

				deepEqual(result, { code: 2 });
				sinon.assert.calledOnce(stubFindGroupWithAccountBookMedia);
				sinon.assert.calledOnce(stubUpdateAccountBookMedia);
				sinon.assert.notCalled(stubCreateAccountBookMedia);
				sinon.assert.calledOnce(stubGetRandomString);
				sinon.assert.calledOnce(stubEventEmitter);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check function parameters(If abm is not existed)', async function () {
			const g = new GroupModel({
				userEmail: userInfo.myEmail,
				userType: 'owner' as const,
				accountBookId: userInfo.accountBookId,
			});
			const createdMediaInfo = {
				isSaved: false,
				accountBookId: userInfo.accountBookId,
				name: randomString,
				mimeType: testfile.mimeType,
				size: testfile.size,
				path: medaiInfo.path,
			};
			stubFindGroupWithAccountBookMedia.resolves(g);
			stubUpdateAccountBookMedia.resolves(1);
			const abm = new AccountBookMediaModel({
				...createdMediaInfo,
				id: 1,
			});
			stubCreateAccountBookMedia.resolves(abm);
			stubGetRandomString.resolves(randomString);
			stubEventEmitter.returns(undefined);

			const injectedFunc = updateAccountBookImageInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				fileInfo,
				stringUtil,
				eventEmitter,
				repository,
			});

			try {
				await injectedFunc({
					file: testfile,
					...userInfo,
				});

				sinon.assert.calledWith(stubFindGroupWithAccountBookMedia, {
					userEmail: userInfo.myEmail,
					accountBookId: userInfo.accountBookId,
				});
				sinon.assert.calledWith(stubCreateAccountBookMedia, {
					...createdMediaInfo,
				});
				sinon.assert.calledWith(stubGetRandomString, fileInfo.nameLength, '.jpeg');
				sinon.assert.calledWith(stubEventEmitter, 'upload', {
					name: randomString,
					path: medaiInfo.path,
					buffer: testfile.buffer,
					id: 1,
					beforeName: undefined,
				});
			} catch (err) {
				fail(err as Error);
			}
		});

		it('Check correct result(If abm is not existed)', async function () {
			const g = new GroupModel({
				userEmail: userInfo.myEmail,
				userType: 'owner' as const,
				accountBookId: userInfo.accountBookId,
			});
			const createdMediaInfo = {
				isSaved: false,
				accountBookId: userInfo.accountBookId,
				name: randomString,
				mimeType: testfile.mimeType,
				size: testfile.size,
				path: medaiInfo.path,
			};
			stubFindGroupWithAccountBookMedia.resolves(g);
			stubUpdateAccountBookMedia.resolves(1);
			const abm = new AccountBookMediaModel({
				...createdMediaInfo,
				id: 1,
			});
			stubCreateAccountBookMedia.resolves(abm);
			stubGetRandomString.resolves(randomString);
			stubEventEmitter.returns(undefined);

			const injectedFunc = updateAccountBookImageInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				fileInfo,
				stringUtil,
				eventEmitter,
				repository,
			});

			try {
				const result = await injectedFunc({
					file: testfile,
					...userInfo,
				});

				deepEqual(result, { code: 1 });
				sinon.assert.calledOnce(stubFindGroupWithAccountBookMedia);
				sinon.assert.notCalled(stubUpdateAccountBookMedia);
				sinon.assert.calledOnce(stubCreateAccountBookMedia);
				sinon.assert.calledOnce(stubGetRandomString);
				sinon.assert.calledOnce(stubEventEmitter);
			} catch (err) {
				fail(err as Error);
			}
		});

		it('If g is null', async function () {
			const g = new GroupModel({
				userEmail: userInfo.myEmail,
				userType: 'owner' as const,
				accountBookId: userInfo.accountBookId,
			});
			const abm = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: g.id,
				id: 1,
			});
			const updatedMediaInfo = {
				isSaved: false,
				accountBookId: userInfo.accountBookId,
				name: randomString,
				id: abm.id,
				mimeType: testfile.mimeType,
				size: testfile.size,
				path: medaiInfo.path,
			};
			g.accountbookmedias = abm;
			stubFindGroupWithAccountBookMedia.resolves(null);
			stubUpdateAccountBookMedia.resolves(1);
			stubCreateAccountBookMedia.resolves(
				new AccountBookMediaModel({
					...updatedMediaInfo,
					id: 1,
				}),
			);
			stubGetRandomString.resolves(randomString);
			stubEventEmitter.returns(undefined);

			const injectedFunc = updateAccountBookImageInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				fileInfo,
				stringUtil,
				eventEmitter,
				repository,
			});

			try {
				await injectedFunc({
					file: testfile,
					...userInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroupWithAccountBookMedia);
				sinon.assert.notCalled(stubUpdateAccountBookMedia);
				sinon.assert.notCalled(stubCreateAccountBookMedia);
				sinon.assert.notCalled(stubGetRandomString);
				sinon.assert.notCalled(stubEventEmitter);
			}
		});

		it('If mimeType is unknown type', async function () {
			const g = new GroupModel({
				userEmail: userInfo.myEmail,
				userType: 'owner' as const,
				accountBookId: userInfo.accountBookId,
			});
			const abm = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: g.id,
				id: 1,
			});
			const updatedMediaInfo = {
				isSaved: false,
				accountBookId: userInfo.accountBookId,
				name: randomString,
				id: abm.id,
				mimeType: testfile.mimeType,
				size: testfile.size,
				path: medaiInfo.path,
			};
			g.accountbookmedias = abm;
			stubFindGroupWithAccountBookMedia.resolves(g);
			stubUpdateAccountBookMedia.resolves(1);
			stubCreateAccountBookMedia.resolves(
				new AccountBookMediaModel({
					...updatedMediaInfo,
					id: 1,
				}),
			);
			stubGetRandomString.resolves(randomString);
			stubEventEmitter.returns(undefined);

			const injectedFunc = updateAccountBookImageInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				fileInfo,
				stringUtil,
				eventEmitter,
				repository,
			});

			try {
				await injectedFunc({
					file: { ...testfile, mimeType: 'unknown' },
					...userInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroupWithAccountBookMedia);
				sinon.assert.notCalled(stubUpdateAccountBookMedia);
				sinon.assert.notCalled(stubCreateAccountBookMedia);
				sinon.assert.notCalled(stubGetRandomString);
				sinon.assert.notCalled(stubEventEmitter);
			}
		});

		it('If updateAccountBookMedia resolves 0', async function () {
			const g = new GroupModel({
				userEmail: userInfo.myEmail,
				userType: 'owner' as const,
				accountBookId: userInfo.accountBookId,
			});
			const abm = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: g.id,
				id: 1,
			});
			const updatedMediaInfo = {
				isSaved: false,
				accountBookId: userInfo.accountBookId,
				name: randomString,
				id: abm.id,
				mimeType: testfile.mimeType,
				size: testfile.size,
				path: medaiInfo.path,
			};
			g.accountbookmedias = abm;
			stubFindGroupWithAccountBookMedia.resolves(g);
			stubUpdateAccountBookMedia.resolves(0);
			stubCreateAccountBookMedia.resolves(
				new AccountBookMediaModel({
					...updatedMediaInfo,
					id: 1,
				}),
			);
			stubGetRandomString.resolves(randomString);
			stubEventEmitter.returns(undefined);

			const injectedFunc = updateAccountBookImageInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserTrue },
				fileInfo,
				stringUtil,
				eventEmitter,
				repository,
			});

			try {
				await injectedFunc({
					file: { ...testfile },
					...userInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroupWithAccountBookMedia);
				sinon.assert.calledOnce(stubUpdateAccountBookMedia);
				sinon.assert.notCalled(stubCreateAccountBookMedia);
				sinon.assert.calledOnce(stubGetRandomString);
				sinon.assert.notCalled(stubEventEmitter);
			}
		});

		it('If user is not admin user', async function () {
			const g = new GroupModel({
				userEmail: userInfo.myEmail,
				userType: 'owner' as const,
				accountBookId: userInfo.accountBookId,
			});
			const abm = new AccountBookMediaModel({
				...medaiInfo,
				accountBookId: g.id,
				id: 1,
			});
			const updatedMediaInfo = {
				isSaved: false,
				accountBookId: userInfo.accountBookId,
				name: randomString,
				id: abm.id,
				mimeType: testfile.mimeType,
				size: testfile.size,
				path: medaiInfo.path,
			};
			g.accountbookmedias = abm;
			stubFindGroupWithAccountBookMedia.resolves(g);
			stubUpdateAccountBookMedia.resolves(1);
			stubCreateAccountBookMedia.resolves(
				new AccountBookMediaModel({
					...updatedMediaInfo,
					id: 1,
				}),
			);
			stubGetRandomString.resolves(randomString);
			stubEventEmitter.returns(undefined);

			const injectedFunc = updateAccountBookImageInfo({
				errorUtil: { ...common.errorUtil, CustomError: errorUtil.CustomError },
				validationUtil: { isAdminUser: validationUtil.isAdminUserFalse },
				fileInfo,
				stringUtil,
				eventEmitter,
				repository,
			});

			try {
				await injectedFunc({
					file: { ...testfile },
					...userInfo,
				});

				fail('Expected to error');
			} catch (err) {
				if (err instanceof AssertionError) {
					fail(err);
				}
				sinon.assert.calledOnce(stubFindGroupWithAccountBookMedia);
				sinon.assert.notCalled(stubUpdateAccountBookMedia);
				sinon.assert.notCalled(stubCreateAccountBookMedia);
				sinon.assert.notCalled(stubGetRandomString);
				sinon.assert.notCalled(stubEventEmitter);
			}
		});
	});
});
